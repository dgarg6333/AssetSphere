import Booking from "../models/booking.model.js";
import Asset from "../models/asset.model.js";
import mongoose from 'mongoose';
import { sendBookingConfirmation } from "../utils/userEmail.js";
import Institute from "../models/institute.model.js";
import User from "../models/user.model.js";

/**
 * Normalizes a date to the start of the day (00:00:00.000).
 * @param {Date|string} date - The date to normalize.
 * @returns {Date} The normalized date object.
 */
const normalizeToStartOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Normalizes a date to the end of the day (23:59:59.999).
 * @param {Date|string} date - The date to normalize.
 * @returns {Date} The normalized date object.
 */
const normalizeToEndOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

/**
 * Validates the incoming booking data.
 * @param {object} data - The booking data from the request body.
 * @returns {string[]} An array of validation error messages.
 */
const validateBookingData = (data) => {
  const errors = [];

  // Required fields check
  if (!data.startDate) errors.push("Start date is required");
  if (!data.endDate) errors.push("End date is required");
  if (!data.purpose?.trim()) errors.push("Purpose is required");
  if (!data.attendeeCount) errors.push("Attendee count is required");

  if (errors.length > 0) {
    return errors;
  }

  // Date validation
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const today = normalizeToStartOfDay(new Date());

  if (isNaN(startDate.getTime())) errors.push("Invalid start date format");
  if (isNaN(endDate.getTime())) errors.push("Invalid end date format");

  const startDay = normalizeToStartOfDay(startDate);
  const endDay = normalizeToStartOfDay(endDate);

  if (startDay < today) errors.push("Start date cannot be in the past");
  if (endDay < startDay) errors.push("End date must be after or equal to start date");

  // Duration check (max 30 days)
  const daysDifference = (endDay - startDay) / (1000 * 60 * 60 * 24);
  if (daysDifference > 30) errors.push("Booking duration cannot exceed 30 days");

  // Attendee count validation
  if (data.attendeeCount < 1) errors.push("Attendee count must be at least 1");
  if (data.attendeeCount > 10000) errors.push("Attendee count cannot exceed 10,000");

  return errors;
};

/**
 * Creates a new booking for a specific asset.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const userId = req.user.id;
    const { assetId } = req.params;
    const bookingData = req.body;

    // 1. Validate asset ID format
    if (!mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset ID format"
      });
    }

    // 2. Validate booking data
    const validationErrors = validateBookingData(bookingData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // 3. Check if asset exists
    const asset = await Asset.findById(assetId).session(session);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found"
      });
    }

    // 4. Check capacity
    if (bookingData.attendeeCount > asset.capacity) {
      return res.status(400).json({
        success: false,
        message: `Attendee count (${bookingData.attendeeCount}) exceeds asset capacity (${asset.capacity})`
      });
    }

    // 5. Normalize dates
    const startDate = normalizeToStartOfDay(new Date(bookingData.startDate));
    const endDate = normalizeToEndOfDay(new Date(bookingData.endDate));

    // 6. Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      assetId,
      bookingStatus: 'NORMAL',
      $or: [
        { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
        { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
        { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
      ]
    }).select('startDate endDate purpose userId').populate('userId', 'name');

    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Asset is not available for the selected dates",
        data: {
          conflictingBookings: conflictingBookings.map(booking => ({
            startDate: booking.startDate.toDateString(),
            endDate: booking.endDate.toDateString(),
            purpose: booking.purpose,
            bookedBy: booking.userId?.name || 'Unknown'
          }))
        }
      });
    }

    // 7. Create and save the new booking
    const newBooking = new Booking({
      assetId,
      userId,
      startDate,
      endDate,
      purpose: bookingData.purpose.trim(),
      attendeeCount: bookingData.attendeeCount,
      specialRequests: bookingData.specialRequests?.trim() || '',
      createdBy: userId,
      bookingStatus: 'NORMAL'
    });

    const savedBooking = await newBooking.save({ session });

    const instituteId = asset.instituteId;
    console.log("Institute ID from asset:", instituteId);
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    console.log("Institute details:", institute);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found for sending email");
    }

    //send email notification to user.
    await sendBookingConfirmation(user, savedBooking, asset , institute);
    await session.commitTransaction();

    // 8. Prepare and send the success response
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('assetId', 'name type institutionName capacity')
      .populate('userId', 'name email');

    const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysUntilStart = Math.ceil((startDate - new Date()) / (1000 * 60 * 60 * 24));

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: populatedBooking._id,
        assetName: populatedBooking.assetId.name,
        assetType: populatedBooking.assetId.type,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        durationDays,
        status: 'NORMAL',
        attendeeCount: bookingData.attendeeCount,
        purpose: bookingData.purpose,
        daysUntilStart: Math.max(0, daysUntilStart)
      }
    });

  } catch (error) {
    await session.abortTransaction();

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Database validation failed",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    next(error);
  } finally {
    await session.endSession();
  }
};

/**
 * Retrieves all bookings for the authenticated user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
export const myBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 1. Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // 2. Convert the string userId to a mongoose ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Find all bookings for the user, populate related data, and sort by date
    const bookings = await Booking.find({  userId: objectIdUserId })
      .populate('assetId', 'name type institutionName capacity')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if the booking is already cancelled or completed
    if (booking.bookingStatus !== 'NORMAL') {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled as it is not in a cancellable state"
      });
    }

    // Update the booking status to 'CANCELLED'
    booking.bookingStatus = 'CANCELLED';
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    next(error);
  }
}
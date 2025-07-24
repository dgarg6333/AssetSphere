import Booking from "../models/booking.model.js";
import Asset from "../models/asset.model.js";
import mongoose from 'mongoose';
import cron from 'node-cron';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const normalizeToStartOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const normalizeToEndOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

const validateBookingData = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.startDate) errors.push("Start date is required");
  if (!data.endDate) errors.push("End date is required");
  if (!data.purpose?.trim()) errors.push("Purpose is required");
  if (!data.attendeeCount) errors.push("Attendee count is required");
  
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

const checkAssetAvailability = async (assetId, startDate, endDate) => {
  const conflictingBookings = await Booking.find({
    assetId,
    bookingStatus: { $in: ['PENDING', 'ACTIVE'] },
    $or: [
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
    ]
  }).select('startDate endDate purpose userId').populate('userId', 'name');

  return {
    available: conflictingBookings.length === 0,
    conflicts: conflictingBookings
  };
};

// =============================================================================
// CRON JOBS - Auto Status Management
// =============================================================================

// Activate bookings daily at 12:01 AM
cron.schedule('1 0 * * *', async () => {
  try {
    const today = normalizeToStartOfDay(new Date());
    const result = await Booking.updateMany(
      { bookingStatus: 'PENDING', startDate: { $lte: today } },
      { $set: { bookingStatus: 'ACTIVE' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Activated ${result.modifiedCount} bookings`);
    }
  } catch (error) {
    console.error('❌ Error activating bookings:', error);
  }
});

// Complete bookings daily at 12:02 AM
cron.schedule('2 0 * * *', async () => {
  try {
    const yesterday = normalizeToEndOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const result = await Booking.updateMany(
      { bookingStatus: 'ACTIVE', endDate: { $lt: yesterday } },
      { $set: { bookingStatus: 'COMPLETED' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Completed ${result.modifiedCount} bookings`);
    }
  } catch (error) {
    console.error('❌ Error completing bookings:', error);
  }
});

// Cleanup old bookings weekly on Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const result = await Booking.deleteMany({
      bookingStatus: 'COMPLETED',
      endDate: { $lt: oneYearAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Cleaned up ${result.deletedCount} old bookings`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up bookings:', error);
  }
});

// =============================================================================
// MAIN CONTROLLER
// =============================================================================

export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const userId = "687f0aa3590bb04fabe20044"; // TODO: Replace with req.user.id
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
    
    // 6. Check availability
    const { available, conflicts } = await checkAssetAvailability(assetId, startDate, endDate);
    if (!available) {
      return res.status(409).json({
        success: false,
        message: "Asset is not available for the selected dates",
        data: {
          conflictingBookings: conflicts.map(booking => ({
            startDate: booking.startDate.toDateString(),
            endDate: booking.endDate.toDateString(),
            purpose: booking.purpose,
            bookedBy: booking.userId?.name || 'Unknown'
          }))
        }
      });
    }
    
    // 7. Create and save booking
    const newBooking = new Booking({
      assetId,
      userId,
      startDate,
      endDate,
      purpose: bookingData.purpose.trim(),
      attendeeCount: bookingData.attendeeCount,
      specialRequests: bookingData.specialRequests?.trim() || '',
      createdBy: userId,
      bookingStatus: 'PENDING'
    });
    
    const savedBooking = await newBooking.save({ session });
    await session.commitTransaction();
    
    // 8. Prepare response
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
        status: 'PENDING',
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
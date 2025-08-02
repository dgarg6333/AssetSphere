import Asset from '../models/asset.model.js';
import Booking from '../models/booking.model.js';

export const addAsset = async (req, res, next) => {
    try {
        const id = req.user.id; // Assuming user is set by verifyToken middleware
        const newAsset = new Asset({
            ...req.body,
            ownerId: id 
        });
        const savedAsset = await newAsset.save();
        res.status(201).json(savedAsset);
    } catch (error) {
        next(error);
    }
};

export const getAsset = async (req, res, next) => {
    try {
        const {
            city,
            type,
            minCapacity,
            maxCapacity,
            amenities,
            features,
            startDate, // New query parameter
            endDate    // New query parameter
        } = req.query;

        // Filter by city
        if (city) {
            assetFilter['address.city'] = { $regex: city, $options: 'i' };
        }

        // Filter by type
        if (type) {
            assetFilter.type = { $regex: type, $options: 'i' };
        }

        // Filter by capacity range
        if (minCapacity) {
            assetFilter.capacity = { $gte: parseInt(minCapacity) };
        }
        if (maxCapacity) {
            // Ensure capacity filter is an object before adding $lte
            assetFilter.capacity = { ...(assetFilter.capacity || {}), $lte: parseInt(maxCapacity) };
        }

        // Filter by amenities
        if (amenities) {
            const amenitiesArray = amenities.split(',').map(item => item.trim());
            assetFilter.amenities = { $in: amenitiesArray };
        }

        // Filter by features
        if (features) {
            const featuresArray = features.split(',').map(item => item.trim());
            assetFilter.features = { $in: featuresArray };
        }

        // --- New logic for date-based availability filtering ---
        if (startDate && endDate) {
            const queryStartDate = new Date(startDate);
            const queryEndDate = new Date(endDate);

            // Find asset IDs that have conflicting bookings within the specified date range
            const conflictingBookings = await Booking.find({
                // bookingStatus: { $in: ['PENDING', 'ACTIVE'] }, // Only consider pending or active bookings
                $or: [
                    // Case 1: Existing booking starts within the query range
                    { startDate: { $gte: queryStartDate, $lte: queryEndDate } },
                    // Case 2: Existing booking ends within the query range
                    { endDate: { $gte: queryStartDate, $lte: queryEndDate } },
                    // Case 3: Existing booking completely encompasses the query range
                    { startDate: { $lte: queryStartDate }, endDate: { $gte: queryEndDate } },
                    // Case 4: Query range completely encompasses an existing booking
                    { startDate: { $gte: queryStartDate }, endDate: { $lte: queryEndDate } }
                ]
            }).select('assetId'); // Select only the assetId to minimize data transfer

            // Extract unique asset IDs from conflicting bookings
            const bookedAssetIds = conflictingBookings.map(booking => booking.assetId);

            // Add a filter to exclude these booked asset IDs from the asset search
            if (bookedAssetIds.length > 0) {
                assetFilter._id = { $nin: bookedAssetIds };
            }
        }

        // Get all assets based on the constructed filter
        const assets = await Asset.find(assetFilter)
            .populate('ownerId', 'name email') // Populate owner details
            .sort({ createdAt: -1 }); // Sort by creation date descending

        res.json(assets); // Send the filtered assets as a JSON response

    } catch (error) {
        // Pass any errors to the next middleware (error handling middleware)
        next(error);
    }
};

export const getAssetById = async (req, res) => {
    const { id } = req.params;
    try {
      const asset = await Asset.findById(id).populate('ownerId', 'email');
  
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
  
      res.status(200).json(asset);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};
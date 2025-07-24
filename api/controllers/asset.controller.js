import Asset from '../models/asset.model.js';

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
            features
        } = req.query;

        // Build simple filter
        let filter = { status: 'AVAILABLE' };

        // Filter by city only
        if (city) {
            filter['address.city'] = { $regex: city, $options: 'i' };
        }

        if (type) {
            filter.type = { $regex: type, $options: 'i' }; // Added filter for type
        }

        // Filter by capacity range
        if (minCapacity) {
            filter.capacity = { $gte: parseInt(minCapacity) };
        }
        if (maxCapacity) {
            filter.capacity = { ...filter.capacity, $lte: parseInt(maxCapacity) };
        }

        // Filter by amenities
        if (amenities) {
            const amenitiesArray = amenities.split(',');
            filter.amenities = { $in: amenitiesArray };
        }

        if(features){
            const featuresArray = features.split(',');
            filter.features = { $in: featuresArray };
        }

        // Get all assets without pagination
        const assets = await Asset.find(filter)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(assets);

    } catch (error) {
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
import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    institutionName: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Hall', 'Lab', 'Hostel', 'ClassRoom'],
      index: true
    },
    address: {
      street: { type: String, required: true, trim: true },
      buildingName: { type: String, trim: true },
      locality: { type: String, required: true, trim: true },
      landmark: { type: String, trim: true },
      city: { type: String, required: true, index: true, trim: true },
      district: { type: String, required: true, index: true, trim: true },
      state: { type: String, required: true, index: true, trim: true },
      pincode: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{6}$/
      }
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    features: [{
          type: String,
          required: true,
          trim: true,
          enum: [
            'AC',         // Air Conditioning
            'INTERNET',   // High-Speed Internet
            'PROJECTOR',  // Projector or Display Screen
            'AUDIO',      // Audio System
            'SMART_BOARD' // Smart/Interactive Board
          ]
      }
    ],
    amenities: [{
          type: String,
          required: true,
          trim: true,
          enum: [
            'PARKING',
            'WATER',
            'TECH_SUPPORT',
            'LOCKERS',
            'RESTROOMS',
            'CLEANING',
            'BREAKOUT',
            'COFFEE'
          ]
      }
    ],
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'BOOKED', 'DELETED'],
      default: 'AVAILABLE',
      index: true
    },
    image: {
      type : String,
      default : "https://www.google.com/imgres?q=conference%20hall%20&imgurl=https%3A%2F%2Fwww.tomarhospitality.com%2Fassets%2Fimg%2Fslider%2F4.jpg&imgrefurl=https%3A%2F%2Fwww.tomarhospitality.com%2F&docid=_Jl9jJRnarZ-xM&tbnid=mri1VhScoESaNM&vet=12ahUKEwi9u5rz4s-OAxXPwTgGHXNLIVYQM3oECBMQAA..i&w=1800&h=1000&hcb=2&ved=2ahUKEwi9u5rz4s-OAxXPwTgGHXNLIVYQM3oECBMQAA"
    },
  },
  {
    timestamps: true
  }
);

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
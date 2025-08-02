import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    // bookingStatus: {
    //   type: String,
    //   enum: ['PENDING', 'ACTIVE', 'COMPLETED'],
    //   default: 'PENDING',
    //   index: true
    // },
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    attendeeCount: {
      type: Number,
      required: true,
      min: 1
    },
    specialRequests: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient availability checking
bookingSchema.index({ assetId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ startDate: 1, bookingStatus: 1 });

const booking = mongoose.model('booking', bookingSchema);
export default booking;
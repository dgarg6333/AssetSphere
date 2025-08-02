import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    ownerEmail: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true
    },
    ownerphone: {
      type: String,
      index: true,
      unique: true
    }
  }
);

const Institute = mongoose.model('Institute', instituteSchema);

export default Institute;
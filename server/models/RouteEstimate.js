import mongoose from 'mongoose';

const routeEstimateSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      enum: ['flight', 'train', 'bus'],
      required: true,
    },
    avgCostRange: {
      min: { type: Number, required: true }, // INR per person (one way)
      max: { type: Number, required: true },
    },
    avgDurationHrs: { type: Number },
    bookingLink: { type: String },
  },
  { timestamps: true }
);

// Index for fast source→destination lookup
routeEstimateSchema.index({ source: 1, destination: 1 });

const RouteEstimate = mongoose.model('RouteEstimate', routeEstimateSchema);
export default RouteEstimate;

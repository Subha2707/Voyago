import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number },
    morning: { type: String },
    afternoon: { type: String },
    evening: { type: String },
    meals: { type: String },
    tips: { type: String },
  },
  { _id: false }
);

const costRangeSchema = new mongoose.Schema(
  {
    min: { type: Number },
    max: { type: Number },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: { type: String, trim: true },
  destination: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  travelers: { type: Number, default: 1 },
  budget: { type: Number },
  interests: [{ type: String }],
  flow: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'A',
  },
  generatedItinerary: [itineraryDaySchema],
  estimatedBudget: {
    transport: {
      min: Number,
      max: Number,
      mode: String,
      bookingLink: String,
      journey: [
        {
          _id: false,
          from: String,
          to: String,
          mode: String,
          min: Number,
          max: Number,
          durationHrs: Number,
          bookingLink: String,
          seeded: Boolean,
          note: String,
        },
      ],
    },
    stay: {
      min: Number,
      max: Number,
      tier: String,
    },
    food: costRangeSchema,
    localTransport: costRangeSchema,
    total: costRangeSchema,
  },
  packingList: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;

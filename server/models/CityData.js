import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    description: String,
    entryFeeINR: { type: Number, default: 0 },
    coords: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

const bestMonthSchema = new mongoose.Schema(
  {
    month: String,
    reason: String,
    crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    priceLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    tempRange: String,
  },
  { _id: false }
);

const hospitalSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
  },
  { _id: false }
);

const cityDataSchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    avgHotelCost: {
      budget: { type: Number }, // per night INR
      mid: { type: Number },
      luxury: { type: Number },
    },
    avgFoodCostPerDay: {
      streetFood: { type: Number }, // INR
      restaurant: { type: Number }, // INR
    },
    localTransportCostPerDay: { type: Number }, // INR
    attractions: [attractionSchema],
    cuisine: [{ type: String }],
    localTransportOptions: [{ type: String }],
    bestMonths: [bestMonthSchema],
    safetyScore: { type: Number, min: 1, max: 10 },
    soloTravelerSafety: { type: Number, min: 1, max: 10 },
    womenSafety: { type: Number, min: 1, max: 10 },
    emergencyContacts: {
      police: String,
      ambulance: String,
      touristHelpline: String,
      embassy: String,
    },
    nearestHospitals: [hospitalSchema],
    currency: { type: String }, // ISO code e.g. INR, THB
    countryCode: { type: String }, // e.g. IN, TH
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const CityData = mongoose.model('CityData', cityDataSchema);
export default CityData;

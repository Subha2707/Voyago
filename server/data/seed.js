import 'dotenv/config';
import mongoose from 'mongoose';
import CityData from '../models/CityData.js';
import RouteEstimate from '../models/RouteEstimate.js';
import { citiesData, routeEstimatesData } from './seedData.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voyago';

const seedDatabase = async () => {
  try {
    console.log(`🔌 Connecting to MongoDB for seeding: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully.');

    // Clear existing collections
    console.log('🧹 Clearing existing CityData...');
    await CityData.deleteMany({});
    console.log('🧹 Clearing existing RouteEstimates...');
    await RouteEstimate.deleteMany({});

    // Seed CityData
    console.log(`🌱 Seeding ${citiesData.length} CityData documents...`);
    const seededCities = await CityData.insertMany(citiesData);
    console.log(`✅ Successfully seeded ${seededCities.length} cities.`);

    // Seed RouteEstimates
    console.log(`🌱 Seeding ${routeEstimatesData.length} RouteEstimate documents...`);
    const seededRoutes = await RouteEstimate.insertMany(routeEstimatesData);
    console.log(`✅ Successfully seeded ${seededRoutes.length} route estimates.`);

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedDatabase();

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const FavoriteLocation = require('../models/FavoriteLocation');
const WeatherHistory = require('../models/WeatherHistory');
const AIInsight = require('../models/AIInsight');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.log('Database not accessible for seeding. Skipping DB seed.');
      process.exit(0);
    }

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await FavoriteLocation.deleteMany();
    await WeatherHistory.deleteMany();
    await AIInsight.deleteMany();
    await Notification.deleteMany();

    console.log('Creating initial demo users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@weatherwise.com',
      password: 'adminpassword123',
      role: 'admin',
      preferences: { tempUnit: 'C', notificationsEnabled: true, defaultCity: 'London' },
    });

    const demoUser = await User.create({
      name: 'John Weather',
      email: 'user@weatherwise.com',
      password: 'userpassword123',
      role: 'user',
      preferences: { tempUnit: 'C', notificationsEnabled: true, defaultCity: 'Paris' },
    });

    console.log('Creating sample favorite locations...');
    await FavoriteLocation.create([
      { userId: demoUser._id, locationName: 'London', country: 'UK', notes: 'Work trips' },
      { userId: demoUser._id, locationName: 'Tokyo', country: 'JP', notes: 'Vacation destination' },
      { userId: demoUser._id, locationName: 'New York', country: 'US', notes: 'Family' },
    ]);

    console.log('Creating sample weather history entries...');
    await WeatherHistory.create([
      {
        userId: demoUser._id,
        locationName: 'London',
        country: 'UK',
        currentData: { temp: 18, feelsLike: 17, condition: 'Clouds', description: 'scattered clouds', humidity: 65, windSpeed: 12 },
      },
      {
        userId: demoUser._id,
        locationName: 'Tokyo',
        country: 'JP',
        currentData: { temp: 24, feelsLike: 25, condition: 'Clear', description: 'sunny', humidity: 55, windSpeed: 8 },
      },
    ]);

    console.log('Creating sample AI insights...');
    await AIInsight.create([
      {
        userId: demoUser._id,
        locationName: 'London',
        summary: 'Expect cloudy skies with cool breezes throughout the afternoon.',
        clothingRecommendations: ['Light jacket', 'Jeans', 'Sneakers'],
        travelPrecautions: ['Carry a light umbrella just in case'],
        activitySuggestions: ['Visit the British Museum', 'Coffee walk at Hyde Park'],
        severeAlerts: ['No severe weather advisories'],
      },
    ]);

    console.log('Creating sample system notifications...');
    await Notification.create([
      {
        userId: demoUser._id,
        title: 'Welcome to AI WeatherWise!',
        message: 'Explore real-time forecasts and AI-powered recommendations for your daily planning.',
        type: 'system',
        severity: 'low',
      },
      {
        userId: null,
        title: 'System Performance Upgrade',
        message: 'Weather forecasting engine upgraded with Google Gemini AI integration.',
        type: 'admin_notice',
        severity: 'low',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('--------------------------------------------------');
    console.log('Admin Account: admin@weatherwise.com / adminpassword123');
    console.log('User Account:  user@weatherwise.com  / userpassword123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();

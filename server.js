const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const conn = await connectDB();
    app.locals.dbConnected = Boolean(conn);

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌤️  AI WeatherWise API Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🛡️  Fallback Mode: ${process.env.FALLBACK_MODE || 'true'}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

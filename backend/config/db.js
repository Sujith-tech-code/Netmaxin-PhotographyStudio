const mongoose = require('mongoose');

const connectDB = async () => {
  const connString = process.env.MONGO_URI;

  if (!connString) {
    console.warn('[Database] MONGO_URI not set. Running without a database; DB routes will fail.');
    return;
  }

  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Don't exit: keep the server up so /, /api and /api/health still respond
    console.error(`[Database Error] ${error.message}`);
  }
};

module.exports = connectDB;
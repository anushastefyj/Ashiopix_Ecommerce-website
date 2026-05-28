import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce-db';
    console.log('Connecting to database...');
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Atlas connection failed: ${error.message}`);
    console.log('Attempting connection to local MongoDB fallback...');
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-db');
      console.log(`Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB connection also failed: ${localError.message}`);
      console.warn('WARNING: Running without database. API endpoints will run in sandbox fallback mode.');
    }
  }
};

export default connectDB;

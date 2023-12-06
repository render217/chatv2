const mongoose = require('mongoose');
require('dotenv').config({ path: './src/config/.env' });
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      {
        family: 4, //
      }
    );
    console.log(
      `\n 🍀🍀🍀 MongoDB Connected! Db host: ${connectionInstance.connection.host} 🍀🍀🍀 \n`
    );
    return connectionInstance;
  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;

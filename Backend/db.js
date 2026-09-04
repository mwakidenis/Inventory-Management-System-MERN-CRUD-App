const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/IMS";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    
    // Security: Enable strict mode for queries
    mongoose.set('strict', true);
    
    // Security: Sanitize queries to prevent NoSQL injection
    mongoose.set('sanitizeFilter', true);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Exit process with failure in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectToMongo;

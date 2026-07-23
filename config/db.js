const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongoDB Connected SUcccesfully");
  } catch (error) {
    console.log("Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
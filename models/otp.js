const { required } = require("joi");
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email:{
      type:String,
      require:true,
      lowercase:true,
      trim:true,
    },

    otp:{
      type:String,
      required:true,
    },

    expiresAt: {
      type: Data,
      required: true,
    },
  },
  {
    timestamps:true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
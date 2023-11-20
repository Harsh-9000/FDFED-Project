import { Schema, model } from "mongoose";

const OtpSchema = Schema({
  email: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  otpNumber: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

const Otp = model("Otp", OtpSchema);

export default Otp;

import bcrypt from "bcrypt";
import User from "../models/User.js";
import Proprietor from "../models/Proprietor.js";
import otpGenerator from "otp-generator";
import sendMail from "../utils/sendMail.js";
import Otp from "../models/Otp.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const validateAndOtpSender = async (req, res, next) => {
  try {
    let person;
    const { role, email } = req.body;
    if (!role) {
      throw new Error("Role is not mentioned!");
    }
    if (!email) {
      throw new Error("Email not Provided!");
    }
    const lowercaseRole = role.toLowerCase();
    //  console.log(email,role);
    switch (lowercaseRole) {
      case "user":
        person = await User.findOne({ email: email });
        break;
        case "proprietor":
        person = await Proprietor.findOne({ email: email });
        break;
      default:
        // Handle invalid or unsupported role values
        return next(new ErrorHandler("Role is not valid!", 400));
    }
    if (!person) {
      return next(new ErrorHandler("Email does not exist!", 400));
    }
    // console.log(person);
    await Otp.deleteMany({ email: email });
    const otpNumber = otpGenerator.generate(process.env.OTP_LENGTH, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    // console.log(otpNumber);
    const firstName = person.name.split(" ")[0];
    const body = `<div>
    <p>Hi ${firstName},</p>
    <p>Your One-Time Password (OTP) for resetting your password is:</p>
    <p style="font-size: 1.2em; font-weight: bold;">${otpNumber}</p>
    <p>This OTP is valid for <span style="font-weight:bold;">5 minutes</span>, so please use it promptly.</p>
    <p> If you didn't request this password reset, please ignore this email.</p>
    <p>Thank you for choosing Occasion Mate.</p>
    <p>Best Regards,</p>
    <p>Occasion Mate Support Team</p>
    <span style="display: none;">${new Date()}</span>
  </div>`;

    await sendMail({
      email: email,
      subject: "Regarding Password Reset",
      body: body,
    });
    const otp = new Otp({
      email,
      otpNumber: otpNumber,
    });
    const savedOtp = await otp.save();
    return res.status(201).json({
      success: true,
      message: "Otp sent Successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

export const validateOtp = async (req, res, next) => {
  try {
    const { email, otpNumber } = req.body;
    console.log(email, otpNumber);
    const otp = await Otp.findOne({ email: email, otpNumber: otpNumber });
    // console.log(otp);
    if (!otp) {
      return next(new ErrorHandler("Invalid Otp!", 400));
    }
    await Otp.findOneAndDelete({ email: email, otpNumber: otpNumber });
    return res.status(200).json({
      success: true,
      message: "Otp successfully Validated!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    if (!role) {
      return next(new ErrorHandler("Role is not mentioned!", 400));
    }
    if (!email) {
      return next(new ErrorHandler("Email not Provided!", 400));
    }
    if (!password) {
      return next(new ErrorHandler("Password field is Empty!", 400));
    }
    let person;
    // console.log(role, email, password);
    //Hashing the password
    const saltRounds = 12; // Recommended value for salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const lowercaseRole = role.toLowerCase();
    switch (lowercaseRole) {
      case "user":
        person = await User.findOneAndUpdate(
          { email: email },
          { password: passwordHash },
          { new: true }
        );
        break;
      case "proprietor":
        person = await Proprietor.findOneAndUpdate(
          { email: email },
          { password: passwordHash },
          { new: true }
        );
        break;
      default:
        // Handle invalid or unsupported role values
        return next(new ErrorHandler("Role is not Valid!", 400));
    }
    if (!person) {
      return next(new ErrorHandler("Email is not Valid!", 400));
    }
    // console.log(person);
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully! " });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

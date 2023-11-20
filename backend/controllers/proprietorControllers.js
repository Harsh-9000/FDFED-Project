import Proprietor from "../models/Proprietor.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendMail from "../utils/sendMail.js";
import sendVenueToken from "../utils/venueToken.js";
import jwt from "jsonwebtoken";
import capitalizeName from "../utils/capitalizeName.js";
import path from "path";
import fs from "fs";

const createProprietor = async (req, res, next) => {
  try {
    const { email, password, businessName, phoneNumber, businessAddress } =
      req.body;
    const name = capitalizeName(req.body.name);
    // console.log(name);
    const proprietorEmail = await Proprietor.findOne({ email });

    if (proprietorEmail) {
      //deleting avater file so that the file didn't get created in uploads when proprietor email is already register
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error while deleting file" });
        }
      });
      return next(new ErrorHandler("Proprietor already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const proprietor = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
      businessName: businessName,
      businessAddress: businessAddress,
      phoneNumber: phoneNumber,
    };

    const activationToken = createActivationToken(proprietor);
    const activationUrl = `${process.env.Local_Host}/proprietor/activation/${activationToken}`;
    try {
      const firstName = proprietor.name.split(" ")[0];
      await sendMail({
        email: proprietor.email,
        subject: "Activate your account",
        body: `Hello ${firstName}, please click on the link to activate your account: ${activationUrl}`,
      });
      return res.status(201).json({
        success: true,
        message: `please check your email:- ${proprietor.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// create activation token
const createActivationToken = (proprietor) => {
  return jwt.sign(proprietor, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

const activateProprietor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newProprietor = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );
    if (!newProprietor) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const {
      name,
      email,
      password,
      avatar,
      businessName,
      businessAddress,
      phoneNumber,
    } = newProprietor;

    let proprietor = await Proprietor.findOne({ email });

    if (proprietor) {
      return next(new ErrorHandler("Proprietor already exists", 400));
    }
    proprietor = await Proprietor.create({
      name,
      email,
      avatar,
      password,
      businessName,
      businessAddress,
      phoneNumber,
    });

    sendVenueToken(proprietor, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const loginProprietor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const proprietor = await Proprietor.findOne({ email }).select("+password");

    if (!proprietor) {
      return next(new ErrorHandler("Proprietor doesn't exists!", 400));
    }

    const isPasswordValid = await proprietor.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendVenueToken(proprietor, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// load shop

const getProprietor = catchAsyncErrors(async (req, res, next) => {
  try {
    const proprietor = await Proprietor.findById(req.proprietor._id);

    if (!proprietor) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      proprietor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export { createProprietor, loginProprietor, activateProprietor, getProprietor };

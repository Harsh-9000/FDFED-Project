import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendMail from "../utils/sendMail.js";
import sendToken from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import capitalizeName from "../utils/capitalizeName.js";
import path from "path";
import fs from "fs";

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const name = capitalizeName(req.body.name);
    console.log(name);
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      //deleting avater file so that the file didn't get created in uploads when user email is already register
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error while deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `${process.env.Local_Host}/activation/${activationToken}`;
    try {
      const firstName = user.name.split(" ")[0];
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        body: `Hello ${firstName}, please click on the link to activate your account: ${activationUrl}`,
      });
      return res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

const activateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export { createUser, loginUser, activateUser, getUser };

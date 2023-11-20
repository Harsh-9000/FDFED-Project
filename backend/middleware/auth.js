import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Proprietor from "../models/Proprietor.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
  next();
});

export const isProprietor = catchAsyncErrors(async (req, res, next) => {
  const { proprietor_token } = req.cookies;
  if (!proprietor_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(proprietor_token, process.env.JWT_SECRET_KEY);

  req.proprietor = await Proprietor.findById(decoded.id);

  next();
});

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ProprietorSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter your name!"],
  },
  businessName: {
    type: String,
    trim: true,
    required: [true, "Please enter your business name!"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [true, "Please enter your email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
    trim: true,
  },
  description: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    default: "proprietor",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//  Hash password
ProprietorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //  Salting passwords enhances security by ensuring that identical passwords will have different hashes due to the unique salt.
    try {
      const saltRounds = 12; // Recommended value for salt rounds
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(this.password, salt);
      this.password = passwordHash;
      return next();
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
  return next();
});

// jwt token
ProprietorSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
ProprietorSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

const Proprietor = mongoose.model("Proprietor", ProprietorSchema);
export default Proprietor;

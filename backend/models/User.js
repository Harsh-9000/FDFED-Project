import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter your name!"],
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
  phoneNumber: {
    type: Number,
    trim: true,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//  Hash password
userSchema.pre("save", async function (next) {
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
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;

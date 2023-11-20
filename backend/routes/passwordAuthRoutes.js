import express from "express";
const router = express.Router();

import {
  validateAndOtpSender,
  changePassword,
  validateOtp,
} from "../controllers/passwordResetControllers.js";

router.post("/forgotPassword", validateAndOtpSender);
router.put("/changePassword", changePassword);
router.post("/validateOtp", validateOtp);

export default router;

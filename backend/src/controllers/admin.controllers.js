import jwt from "jsonwebtoken";
import logger from "../config/winston.js";
import User from "../models/user.model.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_LOGIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD || "password";

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const user = await User.findOne({email}).select("-password -isOtpVerified -otpExpires -resetOtp")

    const token = jwt.sign(
      { userId: "69a53ed055f4446199c83dcc", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in",
      user
    });

  } catch (err) {
    logger.error(`Error in admin login: ${err.message}`);
    console.error("Admin login error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const adminDetails = async (req, res) => {

  try {

    const user = req.user;

    if(!user) {
      return res.status(400).json({
        message: "Not authenticated"
      })
    }

    
    return res.status(200).json({
      message: "Admin User",
      user
    })
  } catch (error) {
    
  }

}
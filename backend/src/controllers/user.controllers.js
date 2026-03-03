import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { genToken } from "../config/genToken.js";
import { sendOtpMail, sendWelcomeMail } from "../services/mail.service.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || password == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordStr = typeof password === "string" ? password : String(password);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Your account already exist please login" });
    }

    if (passwordStr.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hash = await bcrypt.hash(passwordStr, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    const token = await genToken(newUser._id, newUser.role);

    res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
});

    await sendWelcomeMail(newUser.email, newUser.name)

    return res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 🧠 Basic checks
    if (!email || password == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordStr = typeof password === "string" ? password : String(password);


    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Your account does not exist Please SignUp" });
    }

    const compare = await bcrypt.compare(passwordStr, user.password);
    if (!compare) {
      return res.status(400).json({ message: "Please enter correct Password" });
    }

    const token = await genToken(user._id, user.role);
    res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
});

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const currUser = async (req, res)=>{
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(400).json("User does not exist")
        }
        
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

export const sendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({email})

    if(!user) {

      return res.status(400).json({
        message: "user email not found"
      })
    }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.resetOtp = otp
  user.isOtpVerified = false;
  user.otpExpires = Date.now() + 5 * 60 * 1000;

  await user.save();

  await sendOtpMail(email, otp)

  res.status(200).json({ message: "OTP send successfully 👍" });

  } catch (error) {
    console.log(error)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
       return res.status(400).json({ message: "Invalid/expired Otp" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verify successfully 👍" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "Otp verification required" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

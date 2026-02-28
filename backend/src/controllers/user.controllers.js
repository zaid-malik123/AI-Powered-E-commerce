import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { genToken } from "../config/genToken.js";
import { sendWelcomeMail } from "../services/mail.service.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || password == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordStr = typeof password === "string" ? password : String(password);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      sameSite: "strict",
      secure: false, // set true in production
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
      return res.status(400).json({ message: "User does not exist" });
    }

    const compare = await bcrypt.compare(passwordStr, user.password);
    if (!compare) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false, // set true in production
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


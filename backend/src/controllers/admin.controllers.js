import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_LOGIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD || "password";

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ userId: "69a53ed055f4446199c83dcc" ,role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({ success: true, message: "Logged in" });
    }

    return res
      .status(401)
      .json({ success: false, message: "Invalid admin credentials" });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

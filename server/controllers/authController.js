import User from "../models/User.js";
import generateToken from "../utils/generateToken.js"; // Fixed import (remove destructuring)

export const registerUser = async (req, res) => {
  try {
    console.log("=== REGISTER USER FUNCTION ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.headers:", req.headers);

    // Check if we have any data at all
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("No body data received");
      return res.status(400).json({
        success: false,
        message: "No data received",
        debug: {
          body: req.body,
          hasFile: !!req.file,
          contentType: req.headers["content-type"],
        },
      });
    }

    const { name, email, password, role = "user" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
        received: { name, email, password: !!password },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate _id (since you're using custom _id)
    const userId = new mongoose.Types.ObjectId().toString();

    // Create new user
    const user = new User({
      _id: userId,
      name,
      email,
      password,
      resume: req.body.resume || "",
      image: req.file ? req.file.filename : "default-image-url",
      role,
    });

    await user.save();
    console.log("User saved successfully:", user._id);

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

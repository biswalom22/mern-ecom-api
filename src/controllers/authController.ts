import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// User registration (signup)
export const registerUser = async (req: any, res: any) => {
  try {
    const { name, emailOrPhone, password } = req.body;

    // Determine if the input is an email or phone
    const email = emailOrPhone.includes("@") ? emailOrPhone : undefined;
    const phone = email ? undefined : Number(emailOrPhone);

    // Ensure at least one of email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// User login
export const loginUser = async (req: any, res: any) => {
  try {
    const { identifier, password } = req.body;

    // Find the user by email or phone
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Generating JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//api to register a user
export const registerUser = async function (req, res) {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({
      email: email,
    });

    if (userExist) {
      return res.json({
        success: false,
        message: "User is already exist..!",
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to login a user
export const loginUser = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email: email,
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.json({
          success: true,
          token,
        });
      }
    }
    return res.json({
      success: false,
      message: "Invalid email or password..!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//api to get user details
export const getUserDetails = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

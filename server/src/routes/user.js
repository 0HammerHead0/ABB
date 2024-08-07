import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const router = express.Router();
const blacklist = new Set();


router.post("/register", async (req, res) => {
  const { firstName, lastName, password, email, receiveOutbidEmails } =
  req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    firstName,
    lastName,
    password: hashedPassword,
    email,
    receiveOutbidEmails,
  });
  await newUser.save();
  res.json({ message: "User created" });
});
router.post("/login", async (req, res) => {
  console.log("LOGIN")
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "59m" });
    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/logout", (req, res) => {
  console.log("LOGOUT")
  console.log(req.headers)
  const token = req.headers.authorization;
  console.log("logout TOKEN",token)
  console.log('blacklist',blacklist.has(token))
  if (token && !blacklist.has(token)) {
    blacklist.add(token);
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("blacklist -> ",blacklist);
  if (blacklist.has(token)) {
    console.log("blacklisted -> ",token);
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  if (token) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = { userId: decoded._id };
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
// Middleware to check if token is blacklisted
export const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization;
  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  next();
};

router.get("/",verifyToken, async (req, res) => {
  const token = req.headers.authorization;
  let user = null;

  if (token) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) return res.sendStatus(403);
      user = { userId: decoded._id };
    });
    if (user) {
      try {
        const foundUser = await UserModel.findById(user.userId);
        if (!foundUser) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(foundUser);
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
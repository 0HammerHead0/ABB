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
    return res.json({ message: "User already exists" });
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
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.json({ message: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "59m" });
    return res.json({ token, userId: user._id });
  } else {
    return res.json({ message: "Invalid credentials" });
  }
});
router.post("/logout", (req, res) => {
  const token = req.headers.authorization;

  if (token && !blacklist.has(token)) {
    blacklist.add(token);
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  console.log(req.headers.authorization);
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

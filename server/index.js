import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from './src/routes/user.js';  // Import user routes
import auctionItemRouter from './src/routes/auctionItem.js';  // Import auction item routes
import bidRouter from './src/routes/bid.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);  // Use user routes
app.use('/api/auction-items', auctionItemRouter);  // Use auction item routes
app.use('/api/bids', bidRouter);
try {
  mongoose.connect(
    "mongodb+srv://shashwatakahammer:yUWyELxYLd7FxqXl@cluster0.jyn2vs1.mongodb.net/ABB?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("MongoDB Connected");
} catch (err) {
  console.log(err);
}

app.listen(3001, () => console.log("Server Started"));
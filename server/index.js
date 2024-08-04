import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//dot env setup
// import dotenv from "dotenv";
// import { userRouter } from "./routes/users.js";
// import { recipeRouter } from "./routes/recipes.js";
// dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// app.use("/auth", userRouter);
// app.use("/recipes", recipeRouter);
try {
  mongoose.connect(
    "mongodb+srv://shashwatakahammer:yUWyELxYLd7FxqXl@cluster0.jyn2vs1.mongodb.net/ABB?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("MongoDB Connected");
} catch (err) {
  console.log(err);
}

app.listen(3001, () => console.log("Server Started"));
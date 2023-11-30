import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import mongoDBConnection from "./config/db.js";
import userRouter from "./routes/AuthRoute.js";
//environment
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// routes
app.use("/", userRouter);
app.listen(PORT, () => {
  mongoDBConnection();
  console.log(`listening on ${PORT}`.bgGreen);
});

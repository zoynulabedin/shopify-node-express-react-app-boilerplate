import express from "express";
import {
  AuthCheckController,
  AuthenticateController,
} from "../controller/AuthCheckController.js";
import { GetHomeController } from "../controller/getHomeController.js";

const userRouter = express.Router();
userRouter.route("/").get(GetHomeController);
userRouter.route("/auth/check-me").post(AuthCheckController);
userRouter.route("/auth/get-shopify-token").post(AuthenticateController);
export default userRouter;

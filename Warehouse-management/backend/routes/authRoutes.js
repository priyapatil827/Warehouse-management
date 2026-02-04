import express from "express";
import {
  signin,
  signup,
  logout,
  checkLoginStatus,
  verifyOtp,
  changePassword,
  forgotPassword,
  changeForgotPassword,
} from "../controllers/authControllers.js";
import { createProduct } from "../controllers/productControllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/logout", logout);

authRouter.post("/verifyOtp", verifyOtp);

authRouter.post("/changePassword", changePassword);
authRouter.post("/forgetPassword", forgotPassword);
authRouter.post("/changeForgetPassword", changeForgotPassword);

authRouter.get("/checkLoginStatus", checkLoginStatus);


export default authRouter;

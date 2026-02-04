import express from "express";
import {
  getAllUsers,
  updateUser,
  getCurrentUser
} from "../controllers/profileController.js";


const profileRouter = express.Router();

// router.post("/add-user",addUser);
profileRouter.get("/get-user",getAllUsers);
profileRouter.put("/update-user",updateUser);
profileRouter.get("/get-current-user",getCurrentUser);

export default profileRouter;

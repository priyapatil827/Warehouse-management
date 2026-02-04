import express from "express";
import { stockIn, stockOut } from "../controllers/stockControllers.js";

const stockRouter = express.Router();

stockRouter.post("/stockIn", stockIn);
stockRouter.post("/stockOut", stockOut);

export default stockRouter;

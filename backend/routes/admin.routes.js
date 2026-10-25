import express from "express";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";
import { adminController } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/admin", isAuth, authorizedAdmin, adminController);

export default adminRouter;

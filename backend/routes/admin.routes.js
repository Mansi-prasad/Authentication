import express from "express";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth";
import adminController from "../controllers/admin.controller";

const adminRoutes = express.Router();

adminRouter.get("/admin", isAuth, authorizedAdmin, adminController);

export default adminRoutes;

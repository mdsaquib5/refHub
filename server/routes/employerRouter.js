import express from "express";
import { login, signup, refreshAccessToken, logout } from "../controllers/employerController.js";
import { employerMiddleware } from "../middlewares/employerAuth.js";

const employerRouter = express.Router();

employerRouter.post("/login", login);
employerRouter.post("/signup", signup);
employerRouter.post("/refresh-token", refreshAccessToken);
employerRouter.post("/logout", employerMiddleware, logout);

export default employerRouter;
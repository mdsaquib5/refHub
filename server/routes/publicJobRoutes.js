import express from "express";
import {
    getActiveJobsForUser
} from "../controllers/publicJobController.js";
import { userMiddleware } from "../middlewares/useAuth.js";

const userJobRouter = express.Router();

// USER LOGIN REQUIRED
userJobRouter.get("/", userMiddleware, getActiveJobsForUser);

export default userJobRouter;
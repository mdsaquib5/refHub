import express from "express";
import { login, signup, refreshAccessToken, logout } from "../controllers/userControlller.js";
import { userMiddleware } from "../middlewares/useAuth.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/logout", userMiddleware, logout);

export default userRouter;
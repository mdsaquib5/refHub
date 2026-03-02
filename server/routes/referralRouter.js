import express from "express";
import { createReferral, getAllReferrals, getReferralById, deleteReferral } from "../controllers/referralController.js";
import { resumeUploader } from "../middlewares/resumeUploader.js";
import { userMiddleware } from "../middlewares/useAuth.js";

const referralRouter = express.Router();

referralRouter.post("/refer", userMiddleware, resumeUploader.single("resume"), createReferral);

referralRouter.get("/", userMiddleware, getAllReferrals);

referralRouter.get("/:referralId", userMiddleware, getReferralById);

referralRouter.delete("/:referralId", userMiddleware, deleteReferral);

export default referralRouter;
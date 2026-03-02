import express from "express";
import {
  getAllReferralsForEmployer,
  getReferralsByJob,
  updateReferralStatus,
} from "../controllers/employerReferralController.js";
import { employerMiddleware } from "../middlewares/employerAuth.js";

const employerReferralRouter = express.Router();

// Get ALL referrals across all employer's jobs
employerReferralRouter.get("/all", employerMiddleware, getAllReferralsForEmployer);

// Get referrals for a specific job
employerReferralRouter.get(
  "/jobs/:jobId/referrals",
  employerMiddleware,
  getReferralsByJob
);

// Update referral status
employerReferralRouter.patch(
  "/referrals/:referralId/status",
  employerMiddleware,
  updateReferralStatus
);

export default employerReferralRouter;

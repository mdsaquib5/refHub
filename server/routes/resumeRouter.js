import express from "express";
import { viewResume } from "../controllers/resumeController.js";

const resumeRouter = express.Router();

// Public endpoint - serves PDF with proper headers for iframe viewing
resumeRouter.get("/:referralId", viewResume);

export default resumeRouter;

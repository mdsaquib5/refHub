import express from "express";
import {
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    getAllJobs
} from "../controllers/jobController.js";
import { employerMiddleware } from "../middlewares/employerAuth.js";

const jobRouter = express.Router();

jobRouter.post("/create", employerMiddleware, createJob);
jobRouter.get("/", employerMiddleware, getAllJobs);
jobRouter.put("/:jobId", employerMiddleware, updateJob);
jobRouter.delete("/:jobId", employerMiddleware, deleteJob);
jobRouter.patch("/:jobId/status", employerMiddleware, updateJobStatus);

export default jobRouter;
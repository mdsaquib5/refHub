import jobModel from "../models/jobModel.js";
import { generateJobCode } from "../utils/jobCode.js";

// create job
export const createJob = async (req, res) => {
    try {
        // job create krne ke liye sbse pehle job owner ko fetch kro.. employerId
        const employerId = req.userId;

        // agr employerId nahi hai toh return kro
        if (!employerId) {
            return res.status(401).json({ success: false, message: "Employer not logged in" });
        }

        // agr employerId hai toh job create krlo
        const job = await jobModel.create({
            employerId,
            jobCode: generateJobCode(),
            ...req.body
        });

        // agr job create ho jaye toh response return kro
        res.status(201).json({ success: true, message: "Job post created successfully", job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// update job
export const updateJob = async (req, res) => {
    try {
        // ab job update krne ke liye job id hai toh return kro
        const { jobId } = req.params;

        // agr job id nahi hai toh return kro
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        // agr job id hai toh job update krlo
        const job = await jobModel.findOneAndUpdate({
            _id: jobId,
            employerId: req.userId
        }, req.body, { new: true });

        // agr job update ho jaye toh response return kro
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
        }

        res.status(201).json({ success: true, message: "Job updated successfully", job });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// delete job
export const deleteJob = async (req, res) => {
    try {
        // ab job delete krne ke liye job id hai..
        const { jobId } = req.params;

        // agr job id nahi hai toh return kro
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        // agr job id hai toh job delete krlo
        const job = await jobModel.findOneAndDelete({
            _id: jobId,
            employerId: req.userId,
        });

        // agr job delete ho jaye toh response return kro
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
        }

        res.status(201).json({ success: true, message: "Job deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Job Status updates
export const updateJobStatus = async (req, res) => {
    try {
        // ab job status update krne ke liye job id hai..
        const { jobId } = req.params;

        // agr job id nahi hai toh return kro
        const { status } = req.body;

        // agr job id nahi hai toh return kro
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required" });
        }

        // agr job id hai toh job status update krlo
        const job = await jobModel.findOneAndUpdate(
            { _id: jobId, employerId: req.userId },
            { status },
            { new: true }
        );

        // agr job status update ho jaye toh response return kro
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
        }

        res.status(201).json({ success: true, message: "Job status updated", job });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get all jobs
export const getAllJobs = async (req, res) => {
    try {
        // agr job get krne ke liye employer id nahi hai toh return kro
        const employerId = req.userId;

        // agr employer id nahi hai toh return kro
        if (!employerId) {
            return res.status(401).json({ success: false, message: "Employer not logged in" });
        }

        // agr employer id hai toh job get krlo
        const jobs = await jobModel.find({ employerId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: jobs.length, jobs });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
import jobModel from "../models/jobModel.js";

// GET all active jobs (for user app) — supports optional ?jobCode= filter
export const getActiveJobsForUser = async (req, res) => {
  try {
    const { jobCode } = req.query;

    const filter = { status: "active" };
    if (jobCode) {
      filter.jobCode = jobCode;
    }

    const jobs = await jobModel
      .find(filter)
      .select(
        "jobCode organizationName jobBasics locations workplace experience skillsRequired salaryRange createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

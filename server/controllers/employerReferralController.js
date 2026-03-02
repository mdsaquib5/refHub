import jobModel from "../models/jobModel.js";
import referralModel from "../models/referralModel.js";

// GET all referrals across all employer's jobs
export const getAllReferralsForEmployer = async (req, res) => {
  try {
    const employerId = req.userId;

    const jobs = await jobModel.find({ employerId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const referrals = await referralModel
      .find({ jobPostId: { $in: jobIds } })
      .populate(
        "jobPostId",
        "jobCode jobBasics.title organizationName locations"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET referrals for a specific job
export const getReferralsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.userId;

    const job = await jobModel.findOne({ _id: jobId, employerId });
    if (!job) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or job not found" });
    }

    const referrals = await referralModel
      .find({ jobPostId: jobId })
      .populate("referredBy.userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE referral status
export const updateReferralStatus = async (req, res) => {
  try {
    const { referralId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "viewed",
      "shortlisted",
      "interviewed",
      "rejected",
      "hired",
    ];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const referral = await referralModel
      .findById(referralId)
      .populate("jobPostId");

    if (!referral) {
      return res
        .status(404)
        .json({ success: false, message: "Referral not found" });
    }

    if (String(referral.jobPostId.employerId) !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    referral.status = status;
    await referral.save();

    res.status(200).json({
      success: true,
      message: "Referral status updated",
      referral,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

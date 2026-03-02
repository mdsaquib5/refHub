import jobModel from "../models/jobModel.js";
import referralModel from "../models/referralModel.js";
import userModel from "../models/userModel.js";
import { uploadResumeToCloudinary } from "../utils/cloudinaryUpload.js";

/* ================= CREATE REFERRAL ================= */
export const createReferral = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("name email");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const {
      jobPostId,
      candidateName,
      candidateEmail,
      mobile,
      currentDesignation,
      currentCTC,
      expectedCTC,
      currentOrganization,
      totalExperience,
      skillSet
    } = req.body;

    if (!jobPostId || !candidateName || !candidateEmail || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const job = await jobModel.findOne({ _id: jobPostId, status: "active" });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or inactive"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required"
      });
    }

    const duplicate = await referralModel.findOne({
      jobPostId,
      "candidate.email": candidateEmail
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Candidate already referred for this job"
      });
    }

    const uploadResult = await uploadResumeToCloudinary(
      req.file,
      `referrals/${jobPostId}/${userId}`
    );

    const referral = await referralModel.create({
      jobPostId,
      referredBy: {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      candidate: {
        name: candidateName,
        email: candidateEmail,
        mobile,
        currentDesignation,
        currentCTC,
        expectedCTC,
        currentOrganization,
        totalExperience,
        skillSet: skillSet?.split(",").map(s => s.trim())
      },
      resume: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });

    return res.status(201).json({
      success: true,
      message: "Referral created",
      referral
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET MY REFERRALS ================= */
export const getAllReferrals = async (req, res) => {
  try {
    const referrals = await referralModel
      .find({ "referredBy.userId": req.userId })
      .populate({
        path: "jobPostId",
        select: "jobCode jobBasics.title organizationName locations"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      referrals
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET REFERRAL BY ID ================= */
export const getReferralById = async (req, res) => {
  try {
    const referral = await referralModel
      .findOne({
        _id: req.params.referralId,
        "referredBy.userId": req.userId
      })
      .populate("jobPostId", "jobCode jobBasics.title");

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found"
      });
    }

    return res.status(200).json({ success: true, referral });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE REFERRAL ================= */
export const deleteReferral = async (req, res) => {
  try {
    const deleted = await referralModel.findOneAndDelete({
      _id: req.params.referralId,
      "referredBy.userId": req.userId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Referral not found or unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral deleted"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
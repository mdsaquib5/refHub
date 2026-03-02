import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
    {
        jobPostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "job",
            required: true,
            index: true
        },

        referredBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
                index: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            }
        },

        candidate: {
            name: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                index: true
            },
            mobile: {
                type: String,
                required: true
            },

            currentDesignation: String,
            currentOrganization: String,

            totalExperience: {
                type: Number,
                min: 0
            },

            currentCTC: Number,
            expectedCTC: Number,

            skillSet: {
                type: [String]
            }
        },

        resume: {
            url: String,
            publicId: String,
            originalName: String,
            size: Number
        },

        hrEmail: {
            type: String
        },
        managerEmail: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "pending",
                "viewed",
                "shortlisted",
                "interviewed",
                "rejected",
                "hired"
            ],
            default: "pending",
            index: true
        }
    },
    { timestamps: true }
);

const referralModel = mongoose.models.referral || mongoose.model("referral", referralSchema);

export default referralModel;
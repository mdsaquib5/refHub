import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        jobCode: {
            type: String,
            unique: true,
            index: true
        },

        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employer",
            required: true,
            index: true
        },

        organizationName: {
            type: String,
            required: true,
            trim: true
        },

        jobBasics: {
            title: {
                type: String,
                required: true,
                trim: true
            },
            department: {
                type: String,
                required: true
            },
            jobCategory: {
                type: String,
                required: true
            }
        },

        jobSummary: {
            type: String,
            required: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        locations: {
            type: [String],
            required: true
        },

        workplace: {
            workType: {
                type: String,
                enum: ["onsite", "remote", "hybrid"],
                required: true
            },
            seniorityLevel: {
                type: String,
                enum: [
                    "intern",
                    "junior",
                    "mid",
                    "senior",
                    "lead",
                    "manager",
                    "director",
                    "executive"
                ],
                required: true
            },
            numberOfOpenings: {
                type: Number,
                required: true,
                min: 1
            }
        },

        experience: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        },

        skillsRequired: {
            type: [String],
            required: true
        },

        salaryRange: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                default: "INR"
            }
        },

        status: {
            type: String,
            enum: ["active", "paused", "closed"],
            default: "active",
            index: true
        }
    },
    { timestamps: true }
);

const jobModel = mongoose.models.job || mongoose.model("job", jobSchema);

export default jobModel;
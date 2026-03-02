import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

const employerModel = mongoose.models.employer || mongoose.model("employer", employerSchema);

export default employerModel;
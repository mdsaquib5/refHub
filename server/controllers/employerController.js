import employerModel from "../models/employerModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
};

export const signup = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        if (!companyName || !email || !password)
            return res.status(400).json({ success: false, message: "All fields required" });

        if (!validator.isEmail(email))
            return res.status(400).json({ success: false, message: "Invalid email format" });

        if (password.length < 6)
            return res.status(400).json({ success: false, message: "Password too short" });

        const existingEmployer = await employerModel.findOne({ email });
        if (existingEmployer)
            return res.status(400).json({ success: false, message: "Employer already exists please login" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const employer = new employerModel({
            companyName,
            email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken({ id: employer._id, role: "employer" });
        const refreshToken = generateRefreshToken({ id: employer._id, role: "employer" });

        employer.refreshToken = refreshToken;
        await employer.save();

        res
            .cookie("employerRefreshToken", refreshToken, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Employer Signup successful",
                accessToken,
                user: { companyName: employer.companyName, email: employer.email },
            });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employer = await employerModel.findOne({ email });
        if (!employer)
            return res.status(401).json({ success: false, message: "Invalid Email" });

        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Invalid credentials" });

        const accessToken = generateAccessToken({ id: employer._id, role: "employer" });
        const refreshToken = generateRefreshToken({ id: employer._id, role: "employer" });

        employer.refreshToken = refreshToken;
        await employer.save();

        res
            .cookie("employerRefreshToken", refreshToken, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Employer Login successful",
                accessToken,
                user: { companyName: employer.companyName, email: employer.email },
            });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.employerRefreshToken;

        if (!refreshToken)
            return res.status(401).json({ success: false, message: "You are not logged in" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (decoded.role !== "employer")
            return res.status(403).json({ success: false, message: "Forbidden" });

        const employer = await employerModel.findById(decoded.id);

        if (!employer || employer.refreshToken !== refreshToken)
            return res.status(403).json({ success: false, message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken({ id: employer._id, role: "employer" });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: { companyName: employer.companyName, email: employer.email },
        });

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};

export const logout = async (req, res) => {
    try {
        const employer = await employerModel.findById(req.userId);
        if (employer) {
            employer.refreshToken = null;
            await employer.save();
        }

        res
            .clearCookie("employerRefreshToken", cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Employer Logout successful"
            });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

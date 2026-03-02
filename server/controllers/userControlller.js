import userModel from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

/* ===================== SIGNUP ===================== */
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "All fields required" });

        if (!validator.isEmail(email))
            return res.status(400).json({ success: false, message: "Invalid email" });

        if (password.length < 6)
            return res.status(400).json({ success: false, message: "Password too short" });

        const existingUser = await userModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken({ id: user._id, role: "user" });
        const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            accessToken,
            user: { name: user.name, email: user.email },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(401).json({ success: false, message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Invalid password" });

        const accessToken = generateAccessToken({ id: user._id, role: "user" });
        const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: { name: user.name, email: user.email },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* ===================== REFRESH TOKEN ===================== */
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ success: false, message: "No refresh token" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken)
            return res.status(403).json({ success: false, message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken({ id: user._id, role: "user" });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: { name: user.name, email: user.email },
        });

    } catch (error) {
        return res.status(401).json({ success: false, message: "Refresh token expired" });
    }
};

/* ===================== LOGOUT ===================== */
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const user = await userModel.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

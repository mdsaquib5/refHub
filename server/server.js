import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDb from "./configs/db.js";

import userRoutes from "./routes/userRouter.js";
import employerRoutes from "./routes/employerRouter.js";
import jobRoutes from "./routes/jobRouter.js";
import referralRouter from "./routes/referralRouter.js";
import userJobRouter from "./routes/publicJobRoutes.js";
import employerReferralRouter from "./routes/employerReferralRoutes.js";

const app = express();
connectDb();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ref-hub-nine.vercel.app",
  "https://referral-employer-panel.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/referral", referralRouter);
app.use("/api/employer/referral", employerReferralRouter);
app.use("/api/user/jobs", userJobRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

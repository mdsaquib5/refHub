import https from "https";
import http from "http";
import referralModel from "../models/referralModel.js";

export const viewResume = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await referralModel.findById(referralId).select("resume");

    if (!referral || !referral.resume?.url) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const cloudinaryUrl = referral.resume.url;
    const fileName = referral.resume.originalName || "resume.pdf";

    // Use native https/http module to fetch from Cloudinary (works on all Node versions)
    const client = cloudinaryUrl.startsWith("https") ? https : http;

    client.get(cloudinaryUrl, (cloudinaryRes) => {
      if (cloudinaryRes.statusCode !== 200) {
        return res.status(502).json({
          success: false,
          message: `Failed to fetch resume (status: ${cloudinaryRes.statusCode})`,
        });
      }

      // Set headers for inline PDF display
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      });

      // Pipe the Cloudinary response directly to our response
      cloudinaryRes.pipe(res);
    }).on("error", (err) => {
      return res.status(502).json({
        success: false,
        message: "Failed to fetch resume from storage",
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import https from "https";
import http from "http";
import referralModel from "../models/referralModel.js";
import cloudinary from "../configs/cloudinary.js";

export const viewResume = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await referralModel.findById(referralId).select("resume");

    if (!referral || !referral.resume?.url) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const fileName = referral.resume.originalName || "resume.pdf";

    // Generate a signed URL from Cloudinary using the publicId
    // This bypasses any access restrictions on the stored URL
    let cloudinaryUrl;
    if (referral.resume.publicId) {
      cloudinaryUrl = cloudinary.url(referral.resume.publicId, {
        resource_type: "raw",
        sign_url: true,
        type: "upload",
      });
    } else {
      // Fallback to stored URL if no publicId
      cloudinaryUrl = referral.resume.url;
    }

    const client = cloudinaryUrl.startsWith("https") ? https : http;

    client.get(cloudinaryUrl, (cloudinaryRes) => {
      // Follow redirects (301/302)
      if (cloudinaryRes.statusCode >= 300 && cloudinaryRes.statusCode < 400 && cloudinaryRes.headers.location) {
        const redirectClient = cloudinaryRes.headers.location.startsWith("https") ? https : http;
        redirectClient.get(cloudinaryRes.headers.location, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            return res.status(502).json({
              success: false,
              message: `Failed to fetch resume (status: ${redirectRes.statusCode})`,
            });
          }
          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${fileName}"`,
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          });
          redirectRes.pipe(res);
        }).on("error", () => {
          return res.status(502).json({
            success: false,
            message: "Failed to fetch resume from storage",
          });
        });
        return;
      }

      if (cloudinaryRes.statusCode !== 200) {
        return res.status(502).json({
          success: false,
          message: `Failed to fetch resume (status: ${cloudinaryRes.statusCode})`,
        });
      }

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      });

      cloudinaryRes.pipe(res);
    }).on("error", () => {
      return res.status(502).json({
        success: false,
        message: "Failed to fetch resume from storage",
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

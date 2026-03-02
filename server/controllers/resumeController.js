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

    // Fetch PDF from Cloudinary
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Failed to fetch resume from storage" });
    }

    // Set headers for inline PDF display
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "public, max-age=3600",
    });

    // Stream the PDF to the client
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

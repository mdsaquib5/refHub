import multer from "multer";

export const resumeUploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            cb(new Error("Only PDF files allowed"), false);
        }
        cb(null, true);
    }
});
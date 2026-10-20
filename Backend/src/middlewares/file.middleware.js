const multer = require("multer");

const MAX_FILE_SIZE_MB = 3;

const fileFilter = (req, file, cb) => {
    const looksLikePdf = file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname);

    if (looksLikePdf) {
        return cb(null, true);
    }

    const error = new Error("Only PDF files are allowed.");
    error.code = "INVALID_FILE_TYPE";
    cb(error);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024
    },
    fileFilter
});

const uploadSingleResume = upload.single("resume");

function uploadResume(req, res, next) {
    uploadSingleResume(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "Your resume is too large.",
                errors: { profile: `Resume must be ${MAX_FILE_SIZE_MB} MB or smaller.` }
            });
        }

        if (err.code === "INVALID_FILE_TYPE") {
            return res.status(400).json({
                message: "Your resume must be a PDF.",
                errors: { profile: "Only PDF files are supported." }
            });
        }

        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                message: "The file upload failed.",
                errors: { profile: "We couldn't upload this file. Try another one." }
            });
        }

        next(err);
    });
}

module.exports = uploadResume;
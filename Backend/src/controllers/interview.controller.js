const { PDFParse } = require("pdf-parse");
const { generateInterviewReport, generateResumePDF } = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");
const mongoose = require("mongoose");

const MAX_TEXT_LENGTH = 5000;
const asText = (value) => (typeof value === "string" ? value.trim() : "");

function sendAiFailure(res, err, fallbackMessage) {
    console.error(err);

    if (err.status === 429) {
        return res.status(429).json({
            message: "The AI service is busy right now. Please wait a minute and try again."
        });
    }

    return res.status(502).json({
        message: fallbackMessage
    });
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {
    const body = req.body || {};
    const jobDescription = asText(body.jobDescription);
    const selfDescription = asText(body.selfDescription);

    const errors = {};

    if (!jobDescription) {
        errors.jobDescription = "Job description is required.";
    } else if (jobDescription.length > MAX_TEXT_LENGTH) {
        errors.jobDescription = `Job description must be ${MAX_TEXT_LENGTH} characters or fewer.`;
    }

    if (selfDescription.length > MAX_TEXT_LENGTH) {
        errors.selfDescription = `Self description must be ${MAX_TEXT_LENGTH} characters or fewer.`;
    }

    if (!req.file && !selfDescription) {
        errors.profile = "Upload your resume or write a short self-description.";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Please fix the highlighted fields.",
            errors
        });
    }

    let resumeText = "";

    if (req.file) {
        try {
            const parsed = await (new PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = asText(parsed.text);
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                message: "We couldn't read your resume.",
                errors: { profile: "We couldn't read this PDF. Try another file, or use the self-description instead." }
            });
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "We couldn't read your resume.",
                errors: { profile: "No text was found in this PDF (it may be a scan). Try another file, or use the self-description instead." }
            });
        }
    }

    let interviewReportByAI;
    try {
        interviewReportByAI = await generateInterviewReport({
            resume: resumeText || "Not provided",
            selfDescription: selfDescription || "Not provided",
            jobDescription
        });
    } catch (err) {
        return sendAiFailure(res, err, "The AI service couldn't create your plan. Please try again.");
    }

    let interviewReport;
    try {
        interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,

            ...interviewReportByAI
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return sendAiFailure(res, err, "The AI returned an incomplete plan. Please try again.");
        }
        throw err;
    }

    res.status(201).json({
        message: "Interview  report generated successfully",
        interviewReport
    });
}


/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    if (!mongoose.isValidObjectId(interviewId)) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}


/**
 * @description Controller to get all interview reports of a logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    if (!mongoose.isValidObjectId(interviewReportId)) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    let pdfBuffer;
    try {
        pdfBuffer = await generateResumePDF({ resume, jobDescription, selfDescription });
    } catch (err) {
        return sendAiFailure(res, err, "We couldn't create your resume PDF. Please try again.");
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
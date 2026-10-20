const { Router } = require("express");
const interviewController = require("../controllers/interview.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const uploadResume = require("../middlewares/file.middleware.js");

const interviewRouter = Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, uploadResume, interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume PDF on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;
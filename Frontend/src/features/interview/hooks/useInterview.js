import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useToast } from "../../toast/hooks/useToast.js";

const READY_TOAST_DURATION = 15000;

const getErrorMessage = (error, fallback) => {
    if (!error.response) return "Can't reach the server. Check your internet connection and try again.";
    if (error.response.status === 401) return "Your session has expired. Please log in again.";
    return error.response.data?.message || fallback;
};

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { generating, setGenerating,
            reportsLoading, setReportsLoading,
            reportLoading, setReportLoading,
            pdfLoading, setPdfLoading, 
            report, setReport,
            reports, setReports,
            generationStartedAt, setGenerationStartedAt
        } = context;

    const { showToast, dismissToast } = useToast();
    
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setGenerating(true);
        setGenerationStartedAt(Date.now());
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            const newReport = response.interviewReport;
            setReport(newReport);
            setReports(prev => [newReport, ...prev]);

            if(window.location.pathname !== "/") {
                showToast({ 
                    type: "success", 
                    message: "Your interview plan is ready!", 
                    reportId: newReport._id, 
                    duration: READY_TOAST_DURATION 
                });
            }
            return { report: newReport, fieldErrors: {} };
        } catch (error) {
            console.log(error);
            const fieldErrors = error.response?.data?.errors;

            if (fieldErrors) {
                return { report: null, fieldErrors };
            }

            showToast({ type: "error", message: getErrorMessage(error, "Something went wrong while generating your plan. Please try again.") });
            return { report: null, fieldErrors: {} };
        } finally {
            setGenerating(false);
        }
    }

    const getReportById = async (reportId) => {
        setReportLoading(true);
        try {
            const response = await getInterviewReportById(reportId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            return null
        } finally {
            setReportLoading(false);
        }
    }

    const getReports = async () => {
        setReportsLoading(true);
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            console.log(error)
            return []
        } finally {
            setReportsLoading(false);
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setPdfLoading(true)
        const loadingToastId = showToast({
            type: "loading",
            message: "Generating your resume PDF...",
            duration: null
        })

        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)

            showToast({ type: "success", message: "Your resume PDF has been downloaded." })
        }
        catch (error) {
            console.log(error)
            showToast({ type: "error", message: getErrorMessage(error, "We couldn't create your resume PDF. Please try again.") })
        } finally {
            dismissToast(loadingToastId)
            setPdfLoading(false)
        }
    }

    return { 
        generating, reportsLoading, reportLoading, pdfLoading, report, reports, generationStartedAt,
        generateReport, getReportById, getReports, getResumePdf 
    };
}
import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {
    const [ generating, setGenerating ] = useState(false);
    const [ reportsLoading, setReportsLoading ] = useState(true);
    const [ reportLoading, setReportLoading ] = useState(false);
    const [ pdfLoading, setPdfLoading ] = useState(false);
    const [ report, setReport ] = useState(null);
    const [ reports, setReports ] = useState([]);
    const [ generationStartedAt, setGenerationStartedAt ] = useState(null);

    return (
        <InterviewContext.Provider value={{
            generating, setGenerating,
            reportsLoading, setReportsLoading,
            reportLoading, setReportLoading,
            pdfLoading, setPdfLoading,
            report, setReport,
            reports, setReports,
            generationStartedAt, setGenerationStartedAt
        }}>
            {children}
        </InterviewContext.Provider>
    );
}
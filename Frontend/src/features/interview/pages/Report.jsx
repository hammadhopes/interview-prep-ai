import { useParams } from "react-router";
import Navbar from "../components/Navbar.jsx";
import { useInterview } from "../hooks/useInterview.js";
import { useEffect, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import RoadMapDay from "../components/RoadMapDay.jsx";
import ReportError from "../components/ReportError.jsx";
import ReportDetailSkeleton from "../components/ReportDetailSkeleton.jsx";
import "../style/report.scss";

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]


const Report = () => {
    const [ activeNav, setActiveNav ] = useState("technical");
    const [ navOpen, setNavOpen ] = useState(false);
    const navRef = useRef(null);
    const { report, pdfLoading, getReportById, getResumePdf } = useInterview();
    const { reportId } = useParams();
    const [ loadFailed, setLoadFailed ] = useState(false);

    useEffect(() => {
        const loadReport = async () => {
            setLoadFailed(false);
            const result = await getReportById(reportId);
            if(!result) setLoadFailed(true);
        };

        loadReport();
    }, [ reportId ]);

    useEffect(() => {
        if (!navOpen) return;

        const handleOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setNavOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutside);
        return () => document.removeEventListener("pointerdown", handleOutside);
    }, [ navOpen ]);

    if(!(report && report._id === reportId)) {
        return (
            <>
                <Navbar />
                <div className="report-page">
                    {loadFailed ? <ReportError /> : <ReportDetailSkeleton />}
                </div>
            </>
        );
    }

    const scoreColor = 
        report.matchScore >= 80 ? "match-score__ring--high" :
            report.matchScore >= 60 ? "match-score__ring--mid" : "match-score__ring--low";

    const navPanel = (extraClass = "") => (
        <nav className={`report-nav ${extraClass}`}>
            <p className="report-nav__label">Sections</p>
            <div className="report-nav__content">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`report-nav__item ${activeNav == item.id ? "report-nav__item--active" : ''}`}
                        onClick={() => { setActiveNav(item.id); setNavOpen(false); }}
                    >
                        <span className="report-nav__icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );

    const navToggle = (
        <div className="nav-popover" ref={navRef}>
            <i className="fa-solid fa-bars report-content__icon" onClick={() => setNavOpen(o => !o)}></i>
            {navOpen && navPanel("report-nav--popover")}
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="report-page">
                <div className="report">
                    {/* Report Sidebar */}
                    <aside className="report__sidebar">

                        {/* Report Navigation Panel */}
                        {navPanel()}

                        {/* Report Statistics */}
                        <div className="report__stats">
                            <div className="report__sidebarcontainer">
                                <div className="match-score">
                                    <p className="match-score__label">Match Score</p>
                                    <div className={`match-score__ring ${scoreColor}`}>
                                        <span className="match-score__value">{report.matchScore}</span>
                                        <span className="match-score__pct">%</span>
                                    </div>
                                </div>

                                <div className="stats-divider" />

                                <div className="skill-gaps">
                                    <p className="skill-gaps__label">Skill Gaps</p>
                                    <div className="skill-gaps__list">
                                        {report.skillGaps.map((gap, i) => (
                                            <span key={i} className={`skill-gaps__tag skill-gaps__tag--${gap.severity}`}>
                                                {gap.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="stats-divider stats-divider--none" />

                            <button
                                onClick={() => { getResumePdf(reportId) }}
                                className="resume-download-button"
                                disabled={pdfLoading}
                            >
                                <svg height={"1rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                                Download Resume
                            </button>
                        </div>
                    </aside>

                    {/* Report Content */}
                    {activeNav === "technical" && (
                        <div className="report-content">
                            <div className="report-content__header">
                                {navToggle}
                                <h2>Technical Questions</h2>
                                <span className="report-content__count">{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className="section-divider" />
                            <div className="q-list">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav == "behavioral" && (
                        <div className="report-content">
                            <div className="report-content__header">
                                {navToggle}
                                <h2>Behavioral Questions</h2>
                                <span className="report-content__count">{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className="section-divider" />
                            <div className="q-list">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav == "roadmap" && (
                        <div className="report-content">
                            <div className="report-content__header">
                                {navToggle}
                                <h2>Preparation Road Map</h2>
                                <span className="report-content__count">{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className="section-divider" />
                            <div className="roadmap-list">
                                {report.preparationPlan.map(day => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Report;

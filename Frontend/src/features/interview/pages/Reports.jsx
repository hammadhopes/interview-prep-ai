import "../style/reports.scss"
import Navbar from "../components/Navbar"
import { useInterview } from "../hooks/useInterview";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import ReportSkeleton from "../components/ReportSkeleton";

const Reports = () => {
  const { reports, reportsLoading, getReports } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, []);

  if(reportsLoading) {
    return (
      <>
        <Navbar />
        <div className="reports-page">
          <h1 className="reports__heading">All Reports</h1>
          <ReportSkeleton />
        </div>
      </>
    )
  }

  if(reports.length < 1) {
    return (
      <>
        <Navbar />
        <div className="reports-page alert">
          <p>You currently have no interview reports.</p> 
          <NavLink to={"/"} className={"alert-link"}>Click here to create one.</NavLink>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="reports-page">
        <h1 className="reports__heading">All Reports</h1>
        <ul className='reports__list'>
            {reports.map(report => (
                <li key={report._id} className='reports__item' onClick={() => navigate(`/reports/${report._id}`)}>
                    <h3 className="reports__title">{report.title || 'Untitled Position'}</h3>
                    <p className='reports__meta'>Generated on <span>{new Date(report.createdAt).toLocaleDateString()}</span></p>
                    <p className={`reports__score ${report.matchScore >= 80 ? 'reports__score--high' : report.matchScore >= 60 ? 'reports__score--mid' : 'reports__score--low'}`}>
                      <i className="fa-solid fa-star"></i>
                      Match Score: {report.matchScore}%
                    </p>
                </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default Reports

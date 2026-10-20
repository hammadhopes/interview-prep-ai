import { Link } from "react-router";
import "../style/report-error.scss";

const ReportError = () => {
    return (
        <div className="report-error">
            <i className="fa-solid fa-circle-exclamation report-error__icon"></i>
            <h1 className="report-error__title">We couldn't load this page</h1>
            <p className="report-error__text">
                It may not exist, or you may not have access to it.
            </p>
            <Link className="report-error__link" to={"/reports"}>Back to all reports</Link>
        </div>
    )
}

export default ReportError

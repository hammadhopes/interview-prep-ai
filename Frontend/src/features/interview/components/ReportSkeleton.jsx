import "../style/reports.scss";
import "../style/skeleton.scss";

const ReportSkeleton = () => {
    return (
        <ul className="reports__list reports-skeleton" aria-busy="true" aria-label="Loading reports">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <li key={n} className="reports__item">
                    <span className="skeleton reports-skeleton__title"></span>
                    <span className="skeleton reports-skeleton__meta"></span>
                    <span className="skeleton reports-skeleton__score"></span>
                </li>
            ))}
        </ul>
    );
};

export default ReportSkeleton;

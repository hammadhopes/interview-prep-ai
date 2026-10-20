import "../style/report.scss";
import "../style/skeleton.scss";

const ReportDetailSkeleton = () => {
    return (
        <div className="report detail-skeleton" aria-busy="true" aria-label="Loading report">
            <aside className="report__sidebar">
                <nav className="report-nav">
                    <span className="skeleton detail-skeleton__nav-label"></span>
                    <div className="report-nav__content">
                        {[1, 2, 3].map(n => (
                            <span key={n} className="skeleton detail-skeleton__nav-item"></span>
                        ))}
                    </div>
                </nav>

                <div className="report__stats">
                    <div className="report__sidebarcontainer">
                        <div className="match-score">
                            <span className="skeleton detail-skeleton__label"></span>
                            <span className="skeleton detail-skeleton__ring"></span>
                        </div>

                        <div className="stats-divider" />

                        <div className="skill-gaps">
                            <span className="skeleton detail-skeleton__label"></span>
                            <div className="skill-gaps__list">
                                {[1, 2, 3].map(n => (
                                    <span key={n} className="skeleton detail-skeleton__tag"></span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="stats-divider stats-divider--none" />

                    <span className="skeleton detail-skeleton__button"></span>
                </div>
            </aside>

            <div className="report-content">
                <div className="report-content__header">
                    <span className="skeleton detail-skeleton__title"></span>
                    <span className="skeleton detail-skeleton__count"></span>
                </div>

                <div className="section-divider" />

                <div className="q-list">
                    {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="q-card">
                            <div className="q-card__header">
                                <span className="skeleton detail-skeleton__q-index"></span>
                                <span className="skeleton detail-skeleton__q-text"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailSkeleton;

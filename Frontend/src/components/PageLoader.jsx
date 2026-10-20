import "./page-loader.scss";

const PageLoader = ({ message = "Loading..." }) => {
    return (
        <div className="page-loader" role="status">
            <span className="page-loader__spinner"></span>
            <p className="page-loader__text">{message}</p>
        </div>
    );
};

export default PageLoader;

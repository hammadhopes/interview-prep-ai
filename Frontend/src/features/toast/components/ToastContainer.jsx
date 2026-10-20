import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router";
import "../style/toast.scss";

const ICONS = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    info: "fa-circle-info"
};

const ToastContainer = () => {
    const { toasts, dismissToast } = useToast();
    const navigate = useNavigate();

    const handleView = toast => {
        navigate(`/reports/${toast.reportId}`);
        dismissToast(toast.id);
    };

    return (
        <div className="toasts">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toasts__item toasts__item--${toast.type}`}
                    role={toast.type === "error" ? "alert" : "status"}
                >
                    {toast.type === "loading" ? (
                        <span className="toasts__spinner"></span>
                    ) : (
                        <i className={`fa-solid ${ICONS[toast.type]} toasts__icon`}></i>
                    )}

                    <p className="toasts__text">{toast.message}</p>

                    {toast.reportId && (
                        <button 
                            className="toasts__action"
                            onClick={() => handleView(toast)}
                        >
                            View
                        </button>
                    )}

                    <button
                        className="toasts__close"
                        aria-label="Close"
                        onClick={() => dismissToast(toast.id)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
import "../auth.form.scss";

const FormField = ({ label, htmlFor, error, children }) => {
    return (
        <div className={`form-field ${error ? "form-field--invalid" : ""}`}>
            <label className="form-field__label" htmlFor={htmlFor}>{label}</label>
            {children}
            {error && <p className="form-field__error">{error}</p>}
        </div>
    );
};

export default FormField;
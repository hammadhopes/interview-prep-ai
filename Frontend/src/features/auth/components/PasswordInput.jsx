import { useState } from "react";
import "../auth.form.scss";

const PasswordInput = (inputProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="password-field">
            <input {...inputProps} type={visible ? "text" : "password"} />
            <button
                type="button"
                className="password-field__toggle"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(v => !v)}
            >
                <i className={`fa-solid ${visible ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
        </div>
    );
};

export default PasswordInput;
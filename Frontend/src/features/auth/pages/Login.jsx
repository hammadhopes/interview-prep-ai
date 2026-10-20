import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import { validateEmail, validateLoginPassword } from "../validation";

const validators = {
    email: validateEmail,
    password: validateLoginPassword
};

const Login = () => {
    const { submitting, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: validators[name](value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: validators[name](value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validators.email(values.email),
            password: validators.password(values.password)
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        const loggedIn = await handleLogin({ email: values.email.trim(), password: values.password });
        if (loggedIn) navigate("/");
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to continue preparing for your interviews."
            footer={<>Don't have an account? <Link to="/register">Register</Link></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <FormField label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.email)}
                    />
                </FormField>

                <FormField label="Password" htmlFor="password" error={errors.password}>
                    <PasswordInput
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.password)}
                    />
                </FormField>

                <button className="button primary-button" disabled={submitting}>
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
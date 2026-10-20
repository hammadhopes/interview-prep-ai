import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import { validateUsername, validateEmail, validatePassword } from "../validation";

const validators = {
    username: validateUsername,
    email: validateEmail,
    password: validatePassword
};

const Register = () => {
    const { submitting, handleRegister } = useAuth();
    const navigate = useNavigate();

    const [values, setValues] = useState({ username: "", email: "", password: "" });
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
            username: validators.username(values.username),
            email: validators.email(values.email),
            password: validators.password(values.password)
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        const { success, fieldErrors } = await handleRegister({
            username: values.username.trim(),
            email: values.email.trim(),
            password: values.password
        });

        if (success) {
            navigate("/");
        } else {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up to get an interview plan built around your resume and target job."
            footer={<>Already have an account? <Link to="/login">Login</Link></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <FormField label="Username" htmlFor="username" error={errors.username}>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        autoComplete="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.username)}
                    />
                </FormField>

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
                        placeholder="Create a password"
                        autoComplete="new-password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.password)}
                    />
                </FormField>

                <button className="button primary-button" disabled={submitting}>
                    {submitting ? "Creating account..." : "Register"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Register;
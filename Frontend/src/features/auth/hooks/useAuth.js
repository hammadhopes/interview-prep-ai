import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout } from "../services/auth.api.js";
import { useNavigate } from "react-router";
import { useToast } from "../../toast/hooks/useToast.js";

const getAuthErrorMessage = (error, fallback) => {
    if (!error.response) return "Can't reach the server. Check your internet connection and try again.";
    return error.response.data?.message || fallback;
};

export const useAuth = () => {
    const { user, setUser, checkingSession, submitting, setSubmitting } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async ({ email, password }) => {
        setSubmitting(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
            return true;
        } catch (err) {
            showToast({ type: "error", message: getAuthErrorMessage(err, "Login failed. Please try again.") });
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setSubmitting(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return { success: true, fieldErrors: {} };
        } catch (err) {
            const fieldErrors = err.response?.data?.errors;

            if (fieldErrors) {
                return { success: false, fieldErrors };
            }

            showToast({ type: "error", message: getAuthErrorMessage(err, "Registration failed. Please try again.") });
            return { success: false, fieldErrors: {} };
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        setSubmitting(true);
        try {
            const data = await logout();
            setUser(null);
            navigate("/");
            showToast({ type: "success", message: "You have been logged out.", duration: 4000 });
        } catch (err) {
            showToast({ type: "error", message: getAuthErrorMessage(err, "We couldn't log you out. Please try again.") });
        } finally {
            setSubmitting(false);
        }
    };

    return { user, checkingSession, submitting, handleLogin, handleRegister, handleLogout };
}
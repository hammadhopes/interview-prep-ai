import Navbar from "../../interview/components/Navbar";
import "../auth.form.scss";

const AuthLayout = ({ title, subtitle, footer, children }) => {
    return (
        <>
            <Navbar />
            <main className="auth-page">
                <div className="auth-card">
                    <header className="auth-card__header">
                        <h1 className="auth-card__title">{title}</h1>
                        <p className="auth-card__subtitle">{subtitle}</p>
                    </header>

                    {children}

                    <p className="auth-card__footer">{footer}</p>
                </div>
            </main>
        </>
    );
};

export default AuthLayout;
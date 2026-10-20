import { NavLink } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth.js"
import "../style/navbar.scss";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, handleLogout } = useAuth();

    return (
        <>
            <nav className={`navbar ${isOpen ? "navbar--open" : ""}`}>
                <div className="navbar__label">
                    MENU 
                    <i className="fa-regular fa-circle-xmark navbar__crossicon" onClick={() => setIsOpen(false)}></i>
                </div>
                <div className="navbar__content">
                    <NavLink to={"/"} className={({ isActive }) => `navbar__contentlink ${isActive ? "navbar__contentlink--active" : ""}`}>
                        <i className="fa-regular fa-house"></i> Home
                    </NavLink>
                    <NavLink to={"/reports"} className={({ isActive }) => `navbar__contentlink ${isActive ? "navbar__contentlink--active" : ""}`}>
                        <i className="fa-regular fa-file-lines"></i> Reports
                    </NavLink>
                </div>
                <div className="navbar__auth">
                    {
                        user ? (
                            <button onClick={handleLogout} className="navbar__authlink">
                                <i className="fa-solid fa-right-to-bracket"></i> Logout
                            </button>
                        ) : (
                            <NavLink to={"/login"} className={({ isActive }) => `navbar__authlink ${isActive ? "navbar__authlink--active" : ""}`}>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                            </NavLink>
                        )
                    }
                </div>   
            </nav>

            {isOpen && (
                <div className="navbar__overlay" onClick={() => setIsOpen(false)}></div>
            )}
            
            <nav className="topbar">
                <div className="topbar__icon">
                    <i className="fa-solid fa-bars" onClick={() => setIsOpen(true)}></i>
                </div>
                <div className="topbar__auth">
                    {
                        user ? (
                            <button onClick={handleLogout} className="navbar__authlink topbar__authlink">
                                <i className="fa-solid fa-right-to-bracket"></i> Logout
                            </button>
                        ) : (
                            <NavLink to={"/login"} className={({ isActive }) => `navbar__authlink topbar__authlink ${isActive ? "navbar__authlink--active topbar__authlink--active" : ""}`}>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                            </NavLink>
                        )
                    }
                </div>
            </nav>
        </>
    )
}

export default Navbar

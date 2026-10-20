import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ checkingSession, setCheckingSession ] = useState(true);
    const [ submitting, setSubmitting ] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch(err) {
                if (err.response?.status !== 401) console.log(err);
            } finally {
                setCheckingSession(false);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, checkingSession, setCheckingSession, submitting, setSubmitting }}>
            {children}
        </AuthContext.Provider> 
    )
}
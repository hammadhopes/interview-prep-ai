import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import Navbar from "../../interview/components/Navbar";
import PageLoader from "../../../components/PageLoader";

const Protected = ({ children }) => {
    const { checkingSession, user } = useAuth();

    if(checkingSession) {
        return (
            <>
                <Navbar />
                <PageLoader message="Checking your login..."/>
            </>
        );
    }

    if(!user) {
        return <Navigate to={"/login"} replace/>
    }

    return children;
}

export default Protected;
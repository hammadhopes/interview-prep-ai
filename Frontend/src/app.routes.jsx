import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Reports from "./features/interview/pages/Reports.jsx";
import Report from "./features/interview/pages/Report.jsx";
import ToastContainer from "./features/toast/components/ToastContainer.jsx";

const RootLayout = () => (
    <>
        <Outlet />
        <ToastContainer />
    </>
);

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/", element: <Home /> },
            { path: "/reports/:reportId", element: <Protected><Report /></Protected> }, 
            { path: "/reports", element: <Protected><Reports /></Protected> }
        ]
    }
]);
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated =
        !!localStorage.getItem("authToken") ||
        document.cookie.includes("authToken");

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;

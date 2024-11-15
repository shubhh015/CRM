import React, { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Campaigns from "./pages/Campaigns";
import Dashboard from "./pages/Dashboard";
import GoogleLoginPage from "./pages/GoogleLoginPage";
import SegmentManager from "./pages/Segments";

const App = () => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setAuth(!!token);
    }, []);

    return (
        <Router>
            {auth && <Navbar />}
            <Routes>
                <Route
                    path="/"
                    element={
                        auth ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route path="/login" element={<GoogleLoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/segment"
                    element={
                        <PrivateRoute>
                            <SegmentManager />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/campaigns"
                    element={
                        <PrivateRoute>
                            <Campaigns />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

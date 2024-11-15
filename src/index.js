import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider
            clientId={
                "509126844950-klmdfemipqdipobbr68chm36dhkmgprb.apps.googleusercontent.com"
            }
        >
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);

reportWebVitals();

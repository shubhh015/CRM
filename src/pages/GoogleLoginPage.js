import { Box, Container, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginPage = () => {
    const navigate = useNavigate();

    const responseGoogle = (response) => {
        if (response?.credential) {
            axios
                .post("http://localhost:8000/auth/google", {
                    token: response.credential,
                })
                .then((res) => {
                    const { token, user } = res.data;

                    localStorage.setItem("authToken", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    navigate("/dashboard");
                })
                .catch((err) =>
                    console.log("Error during authentication:", err)
                );
        }
    };

    return (
        <Container
            maxWidth="3xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                padding: 4,
                boxShadow: 3,
            }}
        >
            <Typography
                variant="h4"
                sx={{ color: "#fff", fontWeight: "bold", mb: 3 }}
            >
                Welcome to Mini CRM & Campaign Management
            </Typography>
            <Box>
                <GoogleLogin
                    clientId="509126844950-klmdfemipqdipobbr68chm36dhkmgprb.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                />
            </Box>
        </Container>
    );
};

export default GoogleLoginPage;

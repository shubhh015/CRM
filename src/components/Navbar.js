import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
} from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();

        localStorage.removeItem("authToken");

        navigate("/login");
    };

    return (
        <AppBar
            position="sticky"
            component="nav"
            color="inherit"
            sx={{
                display: localStorage.getItem("authToken") ? "block" : "none",
            }}
        >
            <Container maxWidth="2xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        MyLogo
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Link
                            to="/dashboard"
                            style={{ textDecoration: "none" }}
                        >
                            <Button color="primary">Dashboard</Button>
                        </Link>
                        <Link to="/segment" style={{ textDecoration: "none" }}>
                            <Button color="primary">My Segments</Button>
                        </Link>
                        <Link
                            to="/campaigns"
                            style={{ textDecoration: "none" }}
                        >
                            <Button color="primary">My Campaigns</Button>
                        </Link>

                        <Button color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;

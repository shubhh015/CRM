import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import OpenClosedGraph from "../components/OpenClosedGraph";
import SentPendingGraph from "../components/SentPendingGraph";
import { api, getDashboardStats } from "../services/api";

const Dashboard = () => {
    const [statistics, setStatistics] = useState({
        totalCustomers: 0,
        totalSegments: 0,
        totalCampaigns: 0,
        openCount: 0,
        closedCount: 0,
        sentCount: 0,
        pendingCount: 0,
    });
    const [activeCampaigns, setActiveCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const statsResponse = await getDashboardStats();
                const campaignsResponse = await api.get("/campaigns/count");

                const campaignsWithCounts =
                    campaignsResponse.data.campaignStats || [];
                let openCount = 0;
                let closedCount = 0;
                let sentCount = 0;
                let pendingCount = 0;

                campaignsWithCounts.forEach((campaign) => {
                    openCount += campaign.openCount || 0;
                    closedCount += campaign.closedCount || 0;
                    sentCount += campaign.sentCount || 0;
                    pendingCount += campaign.pendingCount || 0;
                });

                setStatistics({
                    totalCustomers: statsResponse.data.totalCustomers,
                    totalSegments: statsResponse.data.totalSegments,
                    totalCampaigns: statsResponse.data.totalCampaigns,
                    openCount,
                    closedCount,
                    sentCount,
                    pendingCount,
                });

                const activeCampaignsResponse = await api.get(
                    "/campaigns/active"
                );
                const campaigns = Array.isArray(
                    activeCampaignsResponse.data.activeCampaigns
                )
                    ? activeCampaignsResponse.data.activeCampaigns
                    : [];

                setActiveCampaigns(campaigns);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f4f6f8",
                minHeight: "100vh",
                py: 4,
            }}
        >
            <Container sx={{ maxWidth: "lg" }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        textAlign: "center",
                        color: "primary.main",
                        fontWeight: "bold",
                        mb: 4,
                    }}
                >
                    Dashboard
                </Typography>

                {loading ? (
                    <Grid container justifyContent="center">
                        <CircularProgress />
                    </Grid>
                ) : (
                    <>
                        {activeCampaigns.length > 0 ? (
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 2,
                                        textAlign: "center",
                                        color: "secondary.main",
                                    }}
                                >
                                    Active Campaigns
                                </Typography>
                                <Slider {...carouselSettings}>
                                    {activeCampaigns.map((campaign, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                mx: 2,
                                                p: 3,
                                                textAlign: "center",
                                                backgroundColor: "white",
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                    sx={{ mb: 1 }}
                                                >
                                                    {campaign.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    color="green"
                                                    bgcolor={"#AFE1AF"}
                                                    borderRadius={5}
                                                    paddingX={2}
                                                    paddingY={1}
                                                >
                                                    {campaign.state}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Slider>
                            </Box>
                        ) : (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: "center",
                                    mb: 4,
                                    color: "text.secondary",
                                }}
                            >
                                No active campaigns.
                            </Typography>
                        )}

                        {/* Statistics Cards */}
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                textAlign: "center",
                                color: "secondary.main",
                            }}
                        >
                            Key Statistics
                        </Typography>
                        <Grid container spacing={4}>
                            {[
                                {
                                    label: "Total Customers",
                                    value: statistics.totalCustomers,
                                },
                                {
                                    label: "Total Segments",
                                    value: statistics.totalSegments,
                                },
                                {
                                    label: "Total Campaigns",
                                    value: statistics.totalCampaigns,
                                },
                            ].map((stat, index) => (
                                <Grid item xs={12} sm={4} key={index}>
                                    <Card
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            backgroundColor: "white",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            {stat.label}
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            color="primary"
                                        >
                                            {stat.value}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Graphs Section */}
                        <Typography
                            variant="h5"
                            sx={{
                                mt: 5,
                                mb: 2,
                                textAlign: "center",
                                color: "secondary.main",
                            }}
                        >
                            Campaign Performance
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        backgroundColor: "white",
                                        borderRadius: 2,
                                    }}
                                >
                                    <OpenClosedGraph
                                        openCount={statistics.openCount}
                                        closedCount={statistics.closedCount}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        backgroundColor: "white",
                                        borderRadius: 2,
                                    }}
                                >
                                    <SentPendingGraph
                                        sentCount={statistics.sentCount}
                                        pendingCount={statistics.pendingCount}
                                    />
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;

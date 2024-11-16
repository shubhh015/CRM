import {
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
                    openCount += campaign.openCount || 5;
                    closedCount += campaign.closedCount || 2;
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

    return (
        <Container sx={{ maxWidth: "3xl" }}>
            <Typography variant="h4" gutterBottom sx={{ marginY: 3 }}>
                Dashboard
            </Typography>

            {loading ? (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            ) : (
                <>
                    {activeCampaigns.length > 0 ? (
                        activeCampaigns.map((campaign, index) => (
                            <div key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {campaign.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            State: {campaign.state}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                No active campaigns.
                            </Typography>
                        </Grid>
                    )}

                    {/* Statistics Cards */}
                    <Grid container spacing={3} style={{ marginTop: 20 }}>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        Total Customers
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistics.totalCustomers}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        Total Segments
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistics.totalSegments}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        Total Campaigns
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistics.totalCampaigns}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} style={{ marginTop: 20 }}>
                        <Grid item xs={12} sm={6}>
                            <OpenClosedGraph
                                openCount={statistics.openCount}
                                closedCount={statistics.closedCount}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SentPendingGraph
                                sentCount={statistics.sentCount}
                                pendingCount={statistics.pendingCount}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default Dashboard;

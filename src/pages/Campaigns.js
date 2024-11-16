import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Fab,
    Grid,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [segments, setSegments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [newCampaignTitle, setNewCampaignTitle] = useState("");
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [loading, setLoading] = useState(true); // Loader state for campaigns
    const [loadingSegments, setLoadingSegments] = useState(false); // Loader state for segments
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const [totalPages, setTotalPages] = useState(1);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString("en-GB");
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
        } else {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    const response = await api.get(`/campaigns/past`, {
                        params: {
                            userId,
                            page,
                            limit,
                        },
                    });

                    setCampaigns(response.data.campaigns);
                    setTotalPages(response.data.pagination.totalPages);
                    setTotalCampaigns(response.data.pagination.totalCampaigns);
                } catch (error) {
                    handleError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCampaigns();
    }, [userId]);

    const fetchSegments = async () => {
        try {
            setLoadingSegments(true);
            const response = await api.get("/segments", {
                params: { userId: userId },
            });

            if (!response.data || response.data.length === 0) {
                setOpenAlert(true);
                setTimeout(() => {
                    navigate("/segment");
                }, 2000);
            } else {
                setSegments(response.data);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingSegments(false);
        }
    };

    const handleOpenMenu = (event, campaignId) => {
        setAnchorEl(event.currentTarget);
        setSelectedCampaignId(campaignId);
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setAnchorEl(null);
    };

    const handleCloseCampaign = async () => {
        try {
            const response = await api.put(
                `/campaigns/${selectedCampaignId}/state`,
                {
                    state: "CLOSED",
                    userId: userId,
                }
            );
            setCampaigns((prevCampaigns) =>
                prevCampaigns.map((campaign) =>
                    campaign._id === selectedCampaignId
                        ? { ...campaign, state: "CLOSED" }
                        : campaign
                )
            );
            handleCloseMenu();
        } catch (error) {
            handleError(error);
        }
    };

    const handleCreateCampaign = async () => {
        if (!newCampaignTitle || !selectedSegment) return;

        try {
            await api.post("/campaigns", {
                title: newCampaignTitle,
                segmentId: selectedSegment._id,
                userId,
            });
            setOpenModal(false);
            window.location.reload();
        } catch (error) {
            handleError(error);
        }
    };

    const handleOpenModal = async () => {
        setOpenModal(true);
        await fetchSegments();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewCampaignTitle("");
        setSelectedSegment(null);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f0f4f8",
                minHeight: "100vh",
                py: 4,
            }}
        >
            <Container sx={{ paddingBottom: 3, backgroundColor: "#f0f4f8" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        marginY: 3,
                        textAlign: "center",
                        color: "#3f51b5",
                        fontWeight: "bold",
                    }}
                >
                    My Campaigns
                </Typography>

                {loading ? (
                    <Grid container justifyContent="center" sx={{ marginY: 5 }}>
                        <CircularProgress />
                    </Grid>
                ) : campaigns.length === 0 ? (
                    <Typography variant="body1" sx={{ marginY: 2 }}>
                        No past campaigns found.{" "}
                        <Button onClick={handleOpenModal} color="primary">
                            Create a New Campaign
                        </Button>
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Campaign Title</TableCell>
                                    <TableCell>Segment Title</TableCell>
                                    <TableCell>Sent Count</TableCell>
                                    <TableCell>Failed Count</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell>Audience Size</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {campaigns.map((campaign) => (
                                    <TableRow key={campaign._id}>
                                        <TableCell>{campaign.title}</TableCell>
                                        <TableCell>
                                            {campaign.segmentTitle || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {campaign.sentCount}
                                        </TableCell>
                                        <TableCell>
                                            {campaign.failedCount}
                                        </TableCell>
                                        <TableCell>{campaign.status}</TableCell>
                                        <TableCell>{campaign.state}</TableCell>
                                        <TableCell>
                                            {campaign.audienceSize || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(campaign.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={(event) =>
                                                    handleOpenMenu(
                                                        event,
                                                        campaign._id
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={handleCloseCampaign}>
                        <ListItemText primary="Close Campaign" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleCloseMenu}>
                        <ListItemText primary="Cancel" />
                    </MenuItem>
                </Menu>

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 56,
                        right: 52,
                        backgroundColor: "#3f51b5",
                    }}
                    onClick={handleOpenModal}
                >
                    <AddIcon />
                </Fab>

                {/* Modal for Creating New Campaign */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "#ffffff",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ color: "#3f51b5", fontWeight: "bold" }}
                        >
                            Create New Campaign
                        </Typography>
                        <TextField
                            fullWidth
                            label="Campaign Title"
                            value={newCampaignTitle}
                            onChange={(e) =>
                                setNewCampaignTitle(e.target.value)
                            }
                            sx={{ marginY: 2 }}
                        />
                        <Autocomplete
                            options={segments}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) =>
                                setSelectedSegment(newValue)
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Select Segment" />
                            )}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                marginY: 2,
                                backgroundColor: "#3f51b5",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                            onClick={handleCreateCampaign}
                        >
                            Create Campaign
                        </Button>
                    </Box>
                </Modal>

                <Snackbar
                    open={openAlert}
                    autoHideDuration={3000}
                    onClose={() => setOpenAlert(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setOpenAlert(false)}
                        severity="warning"
                        variant="filled"
                    >
                        No segments found. Please create a segment first.
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default Campaigns;

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Fab,
    Grid,
    IconButton,
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
import { api } from "../services/api";

const SegmentManager = () => {
    const [segments, setSegments] = useState([]);
    const [groups, setGroups] = useState([
        { logic: "AND", conditions: [{ field: "", operator: "", value: "" }] },
    ]);
    const [segmentName, setSegmentName] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editingSegment, setEditingSegment] = useState(null);
    const [noSegments, setNoSegments] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingSegmentAction, setLoadingSegmentAction] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        setLoading(true);
        try {
            const response = await api.get("/segments", {
                params: { userId: userId },
            });
            if (response.data && response.data.length > 0) {
                setSegments(response.data);
                setNoSegments(false);
            } else {
                setNoSegments(true);
            }
        } catch (error) {
            console.error("Error fetching segments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCondition = (groupIndex) => {
        const newGroups = [...groups];
        newGroups[groupIndex].conditions.push({
            field: "",
            operator: "",
            value: "",
        });
        setGroups(newGroups);
    };

    const handleAddGroup = () => {
        setGroups([
            ...groups,
            {
                logic: "AND",
                conditions: [{ field: "", operator: "", value: "" }],
            },
        ]);
    };

    const handleRemoveCondition = (groupIndex, conditionIndex) => {
        const newGroups = [...groups];
        newGroups[groupIndex].conditions.splice(conditionIndex, 1);
        setGroups(newGroups);
    };

    const handleRemoveGroup = (groupIndex) => {
        const newGroups = [...groups];
        newGroups.splice(groupIndex, 1);
        setGroups(newGroups);
    };

    const handleConditionChange = (groupIndex, conditionIndex, key, value) => {
        const newGroups = [...groups];
        newGroups[groupIndex].conditions[conditionIndex][key] = value;
        setGroups(newGroups);
    };

    const handleGroupLogicChange = (groupIndex, value) => {
        const newGroups = [...groups];
        newGroups[groupIndex].logic = value;
        setGroups(newGroups);
    };

    const createOrUpdateSegment = async () => {
        if (!segmentName) {
            setOpenAlert(true);
            return;
        }

        setLoadingSegmentAction(true);
        try {
            const endpoint = editingSegment
                ? `/segments/${editingSegment._id}`
                : "/segments";
            const method = editingSegment ? "put" : "post";

            await api[method](endpoint, {
                name: segmentName,
                conditions: groups,
                userId: userId,
            });

            fetchSegments();

            setSegmentName("");
            setGroups([
                {
                    logic: "AND",
                    conditions: [{ field: "", operator: "", value: "" }],
                },
            ]);
            setEditingSegment(null);
            setOpenForm(false);
        } catch (error) {
            console.error("Error saving segment:", error);
        } finally {
            setLoadingSegmentAction(false);
        }
    };

    const handleEditSegment = (segment) => {
        setSegmentName(segment.name);
        setGroups(segment.groups || []);
        setEditingSegment(segment);
        setOpenForm(true);
    };

    const handleDeleteSegment = (id) => {
        setSegmentToDelete(id);
        setOpenDeleteModal(true);
    };

    const confirmDeleteSegment = async () => {
        try {
            await api.delete(`/segments/${segmentToDelete}`);
            fetchSegments();
        } catch (error) {
            console.error("Error deleting segment:", error);
        } finally {
            setOpenDeleteModal(false);
        }
    };

    const handleOpenMenu = (event, segment) => {
        setAnchorEl(event.currentTarget);
        setSelectedSegment(segment);
    };

    const handleCloseMenu = () => {
        setSelectedSegment(null);
        setEditingSegment(null);
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f4f6f8",
                minHeight: "100vh",
                py: 4,
            }}
        >
            <Container sx={{ paddingBottom: 3, backgroundColor: "#f9fafb" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        marginY: 3,
                        fontWeight: 600,
                        color: "#3f51b5",
                        textAlign: "center",
                    }}
                >
                    My Segments
                </Typography>

                {loading ? (
                    <Grid container justifyContent="center" sx={{ marginY: 5 }}>
                        <CircularProgress />
                    </Grid>
                ) : noSegments ? (
                    <Typography
                        variant="body1"
                        sx={{
                            marginY: 2,
                            color: "#4f5b62",
                        }}
                    >
                        No segment found.{" "}
                        <Button
                            onClick={() => setOpenForm(true)}
                            color="primary"
                        >
                            Create a New Segment
                        </Button>
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Segment Name
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Conditions
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Audience Size
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Created At
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {segments.map((segment) => (
                                    <TableRow
                                        key={segment._id}
                                        sx={{
                                            "&:nth-of-type(odd)": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <TableCell>{segment.name}</TableCell>
                                        <TableCell>
                                            {segment.conditions.map(
                                                (group, groupIndex) => (
                                                    <div key={groupIndex}>
                                                        {group.conditions.map(
                                                            (
                                                                condition,
                                                                conditionIndex
                                                            ) => (
                                                                <Typography
                                                                    key={
                                                                        conditionIndex
                                                                    }
                                                                >
                                                                    {condition.field
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        condition.field.slice(
                                                                            1
                                                                        )}{" "}
                                                                    {
                                                                        condition.operator
                                                                    }{" "}
                                                                    {
                                                                        condition.value
                                                                    }
                                                                </Typography>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {segment.audienceSize}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                segment.createdAt
                                            ).toLocaleDateString("en-GB")}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(e) =>
                                                    handleOpenMenu(e, segment)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem
                                                    onClick={() =>
                                                        handleEditSegment(
                                                            selectedSegment
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        handleDeleteSegment(
                                                            selectedSegment._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 56,
                        right: 56,
                    }}
                    onClick={() => setOpenForm(true)}
                >
                    <AddIcon />
                </Fab>

                <Modal open={openForm} onClose={() => setOpenForm(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 24,
                            width: 400,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {editingSegment ? "Edit Segment" : "Create Segment"}
                        </Typography>
                        <TextField
                            label="Segment Name"
                            variant="outlined"
                            fullWidth
                            value={segmentName}
                            onChange={(e) => setSegmentName(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        {/* Add form elements for conditions and logic */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={createOrUpdateSegment}
                            disabled={loadingSegmentAction}
                        >
                            {loadingSegmentAction ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save Segment"
                            )}
                        </Button>
                    </Box>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 24,
                            width: 400,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Are you sure you want to delete this segment?
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={confirmDeleteSegment}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setOpenDeleteModal(false)}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Box>
                </Modal>

                <Snackbar
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={() => setOpenAlert(false)}
                >
                    <Alert severity="warning" sx={{ width: "100%" }}>
                        Please enter a segment name.
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default SegmentManager;

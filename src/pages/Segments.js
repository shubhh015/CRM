import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
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
    if (loading) {
        return (
            <Container>
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ marginY: 3 }}>
                Segment Manager
            </Typography>

            {noSegments ? (
                <Typography variant="body1" sx={{ marginY: 2 }}>
                    No segment found.{" "}
                    <Button onClick={() => setOpenForm(true)} color="primary">
                        Create a New Segment
                    </Button>
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Segment Name</TableCell>
                                <TableCell>Conditions</TableCell>
                                <TableCell>Audience Size</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {segments.map((segment) => (
                                <TableRow key={segment._id}>
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
                                                                    .charAt(0)
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

            <Modal open={openForm} onClose={() => setOpenForm(false)}>
                <Box
                    sx={{
                        padding: 4,
                        margin: "auto",
                        maxWidth: 600,
                        backgroundColor: "white",
                        marginTop: "5%",
                    }}
                >
                    <Typography variant="h6">
                        {editingSegment ? "Edit Segment" : "Create New Segment"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Segment Name"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        sx={{ marginY: 2 }}
                    />

                    {groups.map((group, groupIndex) => (
                        <Box key={groupIndex} sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Group Logic</InputLabel>
                                <Select
                                    value={group.logic}
                                    onChange={(e) =>
                                        handleGroupLogicChange(
                                            groupIndex,
                                            e.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="AND">AND</MenuItem>
                                    <MenuItem value="OR">OR</MenuItem>
                                </Select>
                            </FormControl>

                            {group.conditions.map(
                                (condition, conditionIndex) => (
                                    <Box
                                        key={conditionIndex}
                                        sx={{ display: "flex", gap: 2 }}
                                    >
                                        <TextField
                                            label="Field"
                                            value={condition.field}
                                            onChange={(e) =>
                                                handleConditionChange(
                                                    groupIndex,
                                                    conditionIndex,
                                                    "field",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <TextField
                                            label="Operator"
                                            value={condition.operator}
                                            onChange={(e) =>
                                                handleConditionChange(
                                                    groupIndex,
                                                    conditionIndex,
                                                    "operator",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <TextField
                                            label="Value"
                                            value={condition.value}
                                            onChange={(e) =>
                                                handleConditionChange(
                                                    groupIndex,
                                                    conditionIndex,
                                                    "value",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveCondition(
                                                    groupIndex,
                                                    conditionIndex
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )
                            )}

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        handleAddCondition(groupIndex)
                                    }
                                    sx={{ marginY: 2 }}
                                >
                                    Add Condition
                                </Button>
                                <IconButton
                                    onClick={() =>
                                        handleRemoveGroup(groupIndex)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddGroup}
                    >
                        Add Group
                    </Button>

                    <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={createOrUpdateSegment}
                            disabled={loadingSegmentAction}
                        >
                            {loadingSegmentAction ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={() => setOpenAlert(false)}
            >
                <Alert severity="error" sx={{ width: "100%" }}>
                    Segment name is required!
                </Alert>
            </Snackbar>

            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <Paper
                    style={{
                        padding: 20,
                        margin: "auto",
                        marginTop: "20%",
                        maxWidth: 400,
                    }}
                >
                    <Typography variant="h6">Confirm Deletion</Typography>
                    <Typography variant="body1">
                        Are you sure you want to delete this segment?
                    </Typography>
                    <div
                        style={{
                            marginTop: 20,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={confirmDeleteSegment}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenDeleteModal(false)}
                        >
                            No
                        </Button>
                    </div>
                </Paper>
            </Modal>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 56, right: 52 }}
                onClick={() => {
                    setEditingSegment(null);
                    setOpenForm(true);
                }}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default SegmentManager;

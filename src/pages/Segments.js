import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
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

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

    // Fetch segments on component mount
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
                groups: groups,
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

    const handleDeleteSegment = async (id) => {
        if (confirm("Are you sure you want to delete this segment?")) {
            try {
                await api.delete(`/segments/${id}`);
                fetchSegments();
            } catch (error) {
                console.error("Error deleting segment:", error);
            }
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Segment Manager
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenForm(true)}
            >
                Create New Segment
            </Button>

            {noSegments ? (
                <Typography variant="body1" color="textSecondary">
                    No segments found.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {segments.map((segment) => (
                                <TableRow key={segment._id}>
                                    <TableCell>{segment.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleEditSegment(segment)
                                            }
                                            startIcon={<EditIcon />}
                                        >
                                            Edit
                                        </Button>
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteSegment(segment._id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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
        </Container>
    );
};

export default SegmentManager;

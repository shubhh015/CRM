export const getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();
        const totalSegments = await Segment.countDocuments();
        const totalCampaigns = await Campaign.countDocuments();

        const openCount = await Campaign.countDocuments({ state: "ACTIVE" });
        const closedCount = await Campaign.countDocuments({ state: "CLOSED" });
        const sentCount = await CommunicationLog.countDocuments({
            status: "SENT",
        });
        const pendingCount = await CommunicationLog.countDocuments({
            status: "PENDING",
        });

        res.json({
            totalCustomers,
            totalSegments,
            totalCampaigns,
            openCount,
            closedCount,
            sentCount,
            pendingCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

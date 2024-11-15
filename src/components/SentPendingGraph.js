import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const SentPendingGraph = ({ sentCount, pendingCount }) => {
    const data = [
        { name: "Sent", value: sentCount },
        { name: "Pending", value: pendingCount },
    ];

    const COLORS = ["#0088FE", "#FF8042"];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />

                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default SentPendingGraph;

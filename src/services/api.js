import axios from "axios";

export const api = axios.create({
    baseURL: "https://crm-backend-uqvh.onrender.com/api/",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getDashboardStats = async () => {
    return await api.get("/statistics/stats");
};

export const createSegment = async (data) => {
    return await api.post("segments", data);
};

export const getPastCampaigns = async () => {
    return await api.get("campaigns/past");
};

export const sendCampaignMessages = async (segmentId) => {
    return await api.post("campaigns/send", { segmentId });
};

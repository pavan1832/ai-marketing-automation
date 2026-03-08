import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// Leads
export const leadsAPI = {
  create: (data) => api.post("/api/leads", data),
  getAll: (params) => api.get("/api/leads", { params }),
  getById: (id) => api.get(`/api/leads/${id}`),
  update: (id, data) => api.patch(`/api/leads/${id}`, data),
  delete: (id) => api.delete(`/api/leads/${id}`),
};

// Campaigns
export const campaignsAPI = {
  getAll: (params) => api.get("/api/campaigns", { params }),
  getById: (id) => api.get(`/api/campaigns/${id}`),
  regenerate: (leadId) => api.post(`/api/campaigns/regenerate/${leadId}`),
  update: (id, data) => api.patch(`/api/campaigns/${id}`, data),
};

// Analytics
export const analyticsAPI = {
  getOverview: () => api.get("/api/analytics/overview"),
  getIndustry: () => api.get("/api/analytics/industry"),
  getCampaignPerformance: () => api.get("/api/analytics/campaigns"),
  getTimeline: (days) => api.get("/api/analytics/timeline", { params: { days } }),
};

// Webhooks
export const webhookAPI = {
  triggerCampaign: (data) => api.post("/api/webhook/campaign", data),
  updateLeadStatus: (data) => api.post("/api/webhook/lead-status", data),
};

export default api;

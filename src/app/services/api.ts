const BASE_URL = window.location.port === "3000"
  ? "http://localhost:5000/api"   // K8s port-forward
  : "http://localhost:5000/api";  // local dev

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Support both old (userId key) and new (user object) localStorage formats
  const userId = user.id || localStorage.getItem("userId");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(user.email ? { "X-User-Email": user.email } : {}),
      ...(userId ? { "X-User-Id": String(userId) } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── HOME ────────────────────────────────────────────────────────────────────
export const homeApi = {
  get: () =>
    request<{
      success: boolean;
      data: {
        heroStats: { value: string; label: string; color: string }[];
        liveMetrics: { heartRate: number; symptomsLogged: number; healthTrend: string; aiSuggestions: number };
        features: { icon: string; title: string; description: string; color: string }[];
        services: { name: string; status: string; uptime: string }[];
      };
    }>("/home"),
};

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ success: boolean; user: { id: number; name: string; email: string; role: string }; redirectTo: string }>(
      "/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  adminLogin: (email: string, password: string) =>
    request<{ success: boolean; user: { id: number; name: string; email: string; role: string }; redirectTo: string }>(
      "/auth/admin-login", { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  signup: (name: string, email: string, password: string) =>
    request<{ success: boolean; message: string; redirectTo: string }>(
      "/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }
    ),
  forgotPassword: (email: string) =>
    request<{ success: boolean; message: string }>(
      "/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }
    ),
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getAll: () =>
    request<{ success: boolean; data: { stats: any[]; healthTrend: any[]; recentSymptoms: any[]; aiSuggestions: any[]; microservices: any[] } }>(
      "/dashboard"
    ),
};

// ─── SYMPTOMS ────────────────────────────────────────────────────────────────
export const symptomsApi = {
  getHistory: () =>
    request<{ success: boolean; data: any[] }>("/symptoms"),
  getCount: () =>
    request<{ success: boolean; active: number }>("/symptoms/count"),
  getHealthTrend: () =>
    request<{ success: boolean; data: any[] }>("/symptoms/health-trend"),
  getFrequency: () =>
    request<{ success: boolean; data: any[] }>("/symptoms/frequency"),
  add: (payload: { symptom: string; category: string; severity: string; temperature?: number | null; duration?: string }) =>
    request<{ success: boolean; message: string; data: any }>(
      "/symptoms", { method: "POST", body: JSON.stringify(payload) }
    ),
};

// ─── AI ──────────────────────────────────────────────────────────────────────
export const aiApi = {
  getCount: () =>
    request<{ success: boolean; count: number }>("/ai/count"),
  getAnalysis: () =>
    request<{ success: boolean; data: any }>("/ai/analysis"),
  sendFeedback: (conditionId: number, feedback: "up" | "down") =>
    request<{ success: boolean; message: string }>(
      "/ai/feedback", { method: "POST", body: JSON.stringify({ conditionId, feedback }) }
    ),
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () =>
    request<{ success: boolean; data: any }>("/profile"),
  update: (payload: Record<string, string>) =>
    request<{ success: boolean; message: string; data: any }>(
      "/profile", { method: "PUT", body: JSON.stringify(payload) }
    ),
  updateNotification: (id: string, enabled: boolean) =>
    request<{ success: boolean; message: string }>(
      "/profile/notifications", { method: "PUT", body: JSON.stringify({ id, enabled }) }
    ),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean; message: string }>(
      "/profile/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }
    ),
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () =>
    request<{ success: boolean; data: any }>("/admin/dashboard"),

  getUsers: (params?: { risk?: string; status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.risk)   q.set("risk",   params.risk);
    if (params?.status) q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    return request<{ success: boolean; total: number; count: number; data: any[] }>(`/admin/users?${q}`);
  },

  getReports: () =>
    request<{ success: boolean; data: any }>("/admin/reports"),

  getAlerts: (status?: string) => {
    const q = status && status !== "all" ? `?status=${status}` : "";
    return request<{ success: boolean; stats: any; users: any[]; data: any[] }>(`/admin/alerts${q}`);
  },
  sendAlert: (payload: { title: string; message: string; alertType: string; selectedUsers?: number[] }) =>
    request<{ success: boolean; message: string; data: any }>(
      "/admin/alerts", { method: "POST", body: JSON.stringify(payload) }
    ),

  getCounts: () =>
    request<{ success: boolean; severeCases: number; pendingAlerts: number; activePatients: number }>("/admin/counts"),

  getSevereCases: () =>
    request<{ success: boolean; stats: any; data: any[] }>("/admin/severe-cases"),
  sendSevereAlert: (id: number, message: string) =>
    request<{ success: boolean; message: string; data: any }>(
      `/admin/severe-cases/${id}/send-alert`, { method: "POST", body: JSON.stringify({ message }) }
    ),
};

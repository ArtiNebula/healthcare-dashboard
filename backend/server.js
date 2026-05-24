require("dotenv").config();
const express = require("express");
const cors = require("cors");
const client = require("prom-client");

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
});

const symptomsLogged = new client.Counter({
  name: "symptoms_logged_total",
  help: "Total symptoms logged by patients",
  registers: [register],
});

const aiAnalysisRequests = new client.Counter({
  name: "ai_analysis_requests_total",
  help: "Total AI analysis requests",
  registers: [register],
});

// Expose counters globally so routes can use them
global.metricsCounters = { symptomsLogged, aiAnalysisRequests };

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const symptomsRoutes = require("./routes/symptoms");
const dashboardRoutes = require("./routes/dashboard");
const aiRoutes = require("./routes/ai");
const profileRoutes = require("./routes/profile");
const adminUsersRoutes = require("./routes/admin/users");
const adminReportsRoutes = require("./routes/admin/reports");
const adminAlertsRoutes = require("./routes/admin/alerts");
const adminSevereCasesRoutes = require("./routes/admin/severeCases");
const adminDashboardRoutes = require("./routes/admin/dashboard");
const adminCountsRoutes    = require("./routes/admin/counts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:3000", "http://localhost:80", "http://localhost"],
  credentials: true,
}));
app.use(express.json());

// HTTP metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on("finish", () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
  });
  next();
});

// Public routes
app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);

// Admin routes
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/reports", adminReportsRoutes);
app.use("/api/admin/alerts", adminAlertsRoutes);
app.use("/api/admin/severe-cases", adminSevereCasesRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/counts",   adminCountsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Healthcare API running", timestamp: new Date().toISOString() });
});

app.get("/api/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Healthcare API server running at http://localhost:${PORT}`);
});

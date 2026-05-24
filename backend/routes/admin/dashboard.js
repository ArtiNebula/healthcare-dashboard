const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/dashboard — real stats from DB
router.get("/", async (_req, res) => {
  try {
    // Real counts from DB
    const [[userCount]]       = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'patient'");
    const [[symptomCount]]    = await db.query("SELECT COUNT(*) AS total FROM symptoms_history");
    const [[severeCount]]     = await db.query("SELECT COUNT(*) AS total FROM symptoms_history WHERE severity = 'Severe'");
    const [[activeUserCount]] = await db.query("SELECT COUNT(DISTINCT user_id) AS total FROM symptoms_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");

    const stats = [
      { label: "Total Patients",    value: String(userCount.total),      change: "+12%", trend: "up",   icon: "Users"       },
      { label: "Symptoms Logged",   value: String(symptomCount.total),   change: "+8%",  trend: "up",   icon: "Activity"    },
      { label: "Severe Cases",      value: String(severeCount.total),    change: "-3%",  trend: "down", icon: "AlertCircle" },
      { label: "Active This Week",  value: String(activeUserCount.total),change: "+5%",  trend: "up",   icon: "TrendingUp"  },
    ];

    // Keep chart data from static tables (monthly trends / AI usage)
    const [[userGrowth], [aiQueriesByHour], [servicesHealth], [recentActivity], [symptomFrequency]] = await Promise.all([
      db.query("SELECT month_label AS month, total, active FROM user_growth"),
      db.query("SELECT hour_label AS hour, queries FROM ai_queries_by_hour"),
      db.query("SELECT name, icon, response_time AS responseTime, uptime, requests_per_min AS requestsPerMin, status FROM services_health"),
      db.query("SELECT time_label AS time, event, severity FROM recent_activity ORDER BY id ASC"),
      db.query(`
        SELECT JSON_UNQUOTE(JSON_EXTRACT(symptoms, '$[0]')) AS symptom, COUNT(*) AS count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM symptoms_history), 1) AS pct
        FROM symptoms_history
        GROUP BY symptom ORDER BY count DESC LIMIT 6
      `),
    ]);

    res.json({ success: true, data: { stats, userGrowth, aiQueriesByHour, servicesHealth, recentActivity, symptomFrequency } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

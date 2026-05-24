const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/home
router.get("/", async (_req, res) => {
  try {
    const [[heroStats], [liveMetricsRows], [features], [services]] = await Promise.all([
      db.query("SELECT value, label, color FROM home_hero_stats"),
      db.query("SELECT heart_rate AS heartRate, symptoms_logged AS symptomsLogged, health_trend AS healthTrend, ai_suggestions AS aiSuggestions FROM home_live_metrics LIMIT 1"),
      db.query("SELECT icon, title, description, color FROM home_features"),
      db.query("SELECT name, status, uptime FROM home_services"),
    ]);
    const liveMetrics = liveMetricsRows[0] || { heartRate: 72, symptomsLogged: 3, healthTrend: "Improving", aiSuggestions: 2 };
    res.json({ success: true, data: { heroStats, liveMetrics, features, services } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/home/live-metrics
router.patch("/live-metrics", async (req, res) => {
  try {
    const allowed = ["heart_rate", "symptoms_logged", "health_trend", "ai_suggestions"];
    const updates = [];
    const values  = [];
    const map = { heartRate: "heart_rate", symptomsLogged: "symptoms_logged", healthTrend: "health_trend", aiSuggestions: "ai_suggestions" };

    for (const [jsKey, dbCol] of Object.entries(map)) {
      if (req.body[jsKey] !== undefined) {
        updates.push(`${dbCol} = ?`);
        values.push(req.body[jsKey]);
      }
    }
    if (updates.length) {
      await db.query(`UPDATE home_live_metrics SET ${updates.join(", ")} WHERE id = 1`, values);
    }
    const [[rows]] = await db.query("SELECT heart_rate AS heartRate, symptoms_logged AS symptomsLogged, health_trend AS healthTrend, ai_suggestions AS aiSuggestions FROM home_live_metrics LIMIT 1");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

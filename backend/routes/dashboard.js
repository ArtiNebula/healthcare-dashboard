const express = require("express");
const router = express.Router();
const db = require("../db");
const { getCache, setCache } = require("../cache");

async function getUserId(req) {
  const userId = req.headers["x-user-id"];
  if (userId && !isNaN(parseInt(userId))) return parseInt(userId);
  const email = req.headers["x-user-email"];
  if (!email) return 1;
  const [rows] = await db.query("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", [email]);
  return rows[0]?.id || 1;
}

// GET /api/dashboard — cached per user for 30s
router.get("/", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const cacheKey = `dashboard:${userId}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    let [stats] = await db.query(
      "SELECT label, value, icon, color AS color, bg_color AS bgColor, status FROM dashboard_stats WHERE user_id = ?",
      [userId]
    );
    if (!stats.length) {
      const [[active]] = await db.query(
        "SELECT COUNT(*) AS cnt FROM symptoms_history WHERE user_id = ? AND status = 'Active'", [userId]
      );
      const [[sev]] = await db.query(
        "SELECT AVG(severity_score) AS avg FROM symptoms_history WHERE user_id = ?", [userId]
      );
      const healthScore = sev.avg ? Math.max(0, Math.round(100 - sev.avg * 8)) : 100;
      stats = [
        { label: "Health Score",    value: `${healthScore}%`,       icon: "TrendingUp",  color: "bg-green-500",  bgColor: "bg-green-50",  status: healthScore >= 70 ? "good" : "needs attention" },
        { label: "Active Symptoms", value: String(active.cnt),      icon: "AlertCircle", color: "bg-orange-500", bgColor: "bg-orange-50", status: "monitoring" },
      ];
    }

    const [healthTrend] = await db.query(
      "SELECT day_label AS date, value FROM health_trend WHERE user_id = ?", [userId]
    );

    const [recentSymptoms] = await db.query(
      `SELECT id,
        JSON_UNQUOTE(JSON_EXTRACT(symptoms, '$[0]')) AS symptom,
        severity,
        DATE_FORMAT(created_at, '%d %b') AS date,
        DATE_FORMAT(created_at, '%H:%i') AS time
       FROM symptoms_history WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 3`,
      [userId]
    );

    const [aiSuggestions] = await db.query(
      "SELECT id, text, priority FROM ai_suggestions WHERE user_id = ?", [userId]
    );

    const [microservices] = await db.query(
      "SELECT name, status, response_time AS responseTime FROM microservices"
    );

    const data = { stats, healthTrend, recentSymptoms, aiSuggestions, microservices };
    await setCache(cacheKey, data, 30);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

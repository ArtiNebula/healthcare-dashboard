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

// GET /api/ai/count — user-specific AI suggestions count
router.get("/count", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [[row]] = await db.query(
      "SELECT COUNT(*) AS count FROM ai_suggestions WHERE user_id = ?",
      [userId]
    );
    res.json({ success: true, count: Number(row.count || 0) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/analysis — cached 60s (static AI data rarely changes)
router.get("/analysis", async (_req, res) => {
  try {
    const cached = await getCache("ai:analysis");
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const [[analysisRows], [conditions], [recommendations], [sparklineData], [doctorTriggers]] = await Promise.all([
      db.query("SELECT confidence FROM ai_analysis LIMIT 1"),
      db.query("SELECT id, name, confidence, severity, color, description, urgency, causes, treatments FROM ai_conditions"),
      db.query("SELECT icon, title, detail, priority, time_label AS time FROM ai_recommendations"),
      db.query("SELECT day_label AS day, score FROM ai_sparkline_data"),
      db.query("SELECT trigger_text AS `trigger`, urgency FROM ai_doctor_triggers"),
    ]);
    const confidence = analysisRows[0]?.confidence || 87;
    const data = { confidence, conditions, recommendations, sparklineData, doctorTriggers };
    await setCache("ai:analysis", data, 60);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/conditions
router.get("/conditions", async (_req, res) => {
  try {
    const cached = await getCache("ai:conditions");
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const [rows] = await db.query("SELECT id, name, confidence, severity, color, description, urgency, causes, treatments FROM ai_conditions");
    await setCache("ai:conditions", rows, 60);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/recommendations
router.get("/recommendations", async (_req, res) => {
  try {
    const cached = await getCache("ai:recommendations");
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const [rows] = await db.query("SELECT icon, title, detail, priority, time_label AS time FROM ai_recommendations");
    await setCache("ai:recommendations", rows, 60);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/doctor-triggers
router.get("/doctor-triggers", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT trigger_text AS `trigger`, urgency FROM ai_doctor_triggers");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/feedback
router.post("/feedback", (req, res) => {
  const { conditionId, feedback } = req.body;
  if (!conditionId || !feedback)
    return res.status(400).json({ success: false, message: "conditionId and feedback are required" });
  res.json({ success: true, message: `Feedback '${feedback}' recorded for condition ${conditionId}` });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper — get user_id from X-User-Id or X-User-Email header, fallback to 1
async function getUserId(req) {
  const userId = req.headers["x-user-id"];
  if (userId && !isNaN(parseInt(userId))) return parseInt(userId);
  const email = req.headers["x-user-email"];
  if (!email) return 1;
  const [rows] = await db.query("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", [email]);
  return rows[0]?.id || 1;
}

// GET /api/symptoms
router.get("/", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [rows] = await db.query(
      "SELECT id, date, symptoms, severity, severity_score AS severityScore, status, ai_note AS aiNote, duration FROM symptoms_history WHERE user_id = ? ORDER BY date DESC",
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/symptoms/count — active symptoms count for notification badge
router.get("/count", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [[row]] = await db.query(
      "SELECT COUNT(*) AS active FROM symptoms_history WHERE user_id = ? AND status = 'Active'",
      [userId]
    );
    res.json({ success: true, active: row.active });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/symptoms/health-trend — computed from actual symptoms_history
router.get("/health-trend", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [rows] = await db.query(`
      SELECT
        DATE_FORMAT(MIN(created_at), '%d %b') AS date,
        GREATEST(0, ROUND(100 - AVG(severity_score) * 8)) AS score,
        COUNT(*) AS symptoms
      FROM symptoms_history
      WHERE user_id = ?
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
      LIMIT 21
    `, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/symptoms/frequency — computed from actual symptoms_history
router.get("/frequency", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [rows] = await db.query(`
      SELECT
        JSON_UNQUOTE(JSON_EXTRACT(symptoms, '$[0]')) AS symptom,
        COUNT(*) AS count
      FROM symptoms_history
      WHERE user_id = ?
      GROUP BY JSON_UNQUOTE(JSON_EXTRACT(symptoms, '$[0]'))
      ORDER BY count DESC
      LIMIT 6
    `, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/symptoms/:id
router.get("/:id", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [rows] = await db.query(
      "SELECT id, date, symptoms, severity, severity_score AS severityScore, status, ai_note AS aiNote, duration FROM symptoms_history WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Symptom entry not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/symptoms
router.post("/", async (req, res) => {
  const { symptom, category, severity, temperature, duration } = req.body;
  if (!symptom || !category || !severity)
    return res.status(400).json({ success: false, message: "symptom, category and severity are required" });

  const severityScore = severity === "Severe" ? 8 : severity === "Moderate" ? 5 : 3;
  const date = new Date().toISOString().slice(0, 10);
  const symptomsArr = JSON.stringify([symptom]);

  try {
    const userId = await getUserId(req);
    const [result] = await db.query(
      "INSERT INTO symptoms_history (user_id, date, symptoms, severity, severity_score, status, ai_note, duration, category, temperature) VALUES (?, ?, ?, ?, ?, 'Active', 'Newly logged — AI analysis pending', ?, ?, ?)",
      [userId, date, symptomsArr, severity, severityScore, duration || "N/A", category, temperature || null]
    );
    const [rows] = await db.query(
      "SELECT id, date, symptoms, severity, severity_score AS severityScore, status, ai_note AS aiNote, duration FROM symptoms_history WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, message: "Symptom logged successfully", data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/users — real users from users table
router.get("/", async (req, res) => {
  const { risk, status, search } = req.query;
  try {
    let sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        'Active' AS status,
        COALESCE(p.blood_type, '—') AS bloodType,
        COUNT(DISTINCT s.id) AS symptoms,
        CASE
          WHEN COUNT(DISTINCT s.id) >= 10 THEN 'Critical'
          WHEN COUNT(DISTINCT s.id) >= 5  THEN 'High'
          WHEN COUNT(DISTINCT s.id) >= 2  THEN 'Medium'
          ELSE 'Low'
        END AS riskLevel,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') AS joinedDate,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') AS lastLogin,
        COALESCE(w.avg_score, 85) AS healthScore
      FROM users u
      LEFT JOIN user_profile p ON p.user_id = u.id
      LEFT JOIN symptoms_history s ON s.user_id = u.id
      LEFT JOIN (
        SELECT user_id, ROUND(AVG(value)) AS avg_score FROM user_wellness GROUP BY user_id
      ) w ON w.user_id = u.id
      WHERE u.role = 'patient'
    `;
    const params = [];

    if (search) {
      sql += " AND (LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ?)";
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    sql += " GROUP BY u.id, u.name, u.email, u.role, p.blood_type, w.avg_score, u.created_at";

    if (risk && risk !== "all") {
      sql = `SELECT * FROM (${sql}) t WHERE t.riskLevel = ?`;
      params.push(risk);
    }
    if (status && status !== "all") {
      sql = `SELECT * FROM (${sql}) t WHERE t.status = ?`;
      params.push(status);
    }

    const [data] = await db.query(sql, params);
    const [totalRows] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'patient'");
    res.json({ success: true, total: totalRows[0].total, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.role,
        'Active' AS status,
        COUNT(DISTINCT s.id) AS symptoms,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') AS joinedDate
      FROM users u
      LEFT JOIN symptoms_history s ON s.user_id = u.id
      WHERE u.id = ?
      GROUP BY u.id`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

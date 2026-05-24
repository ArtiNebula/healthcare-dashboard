const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/alerts
router.get("/", async (req, res) => {
  const { status } = req.query;
  try {
    let sql = "SELECT id, title, message, recipient, recipient_count AS recipientCount, type, status, sent_at AS sentAt, read_at AS readAt FROM alert_history";
    const params = [];
    if (status && status !== "all") { sql += " WHERE LOWER(status) = LOWER(?)"; params.push(status); }
    sql += " ORDER BY id DESC";

    const [[statsResult], [alertUsers], [data]] = await Promise.all([
      // Compute stats dynamically from alert_history + real patient count
      db.query(`
        SELECT
          COUNT(*) AS totalSent,
          SUM(LOWER(status) = 'sent') AS delivered,
          SUM(LOWER(status) = 'pending') AS pending,
          (SELECT COUNT(*) FROM users WHERE role = 'patient') AS recipients
        FROM alert_history
      `),
      // Real high-risk users from users + symptoms_history
      db.query(`
        SELECT
          u.id,
          u.name,
          CASE
            WHEN COUNT(sh.id) >= 10 THEN 'Critical'
            WHEN COUNT(sh.id) >= 5  THEN 'High'
            ELSE 'Moderate'
          END AS severity
        FROM users u
        LEFT JOIN symptoms_history sh ON sh.user_id = u.id AND sh.severity = 'Severe'
        WHERE u.role = 'patient'
        GROUP BY u.id, u.name
        HAVING COUNT(sh.id) > 0
        ORDER BY COUNT(sh.id) DESC
        LIMIT 20
      `),
      db.query(sql, params),
    ]);

    const stats = {
      totalSent:  Number(statsResult[0]?.totalSent  || 0),
      delivered:  Number(statsResult[0]?.delivered  || 0),
      pending:    Number(statsResult[0]?.pending    || 0),
      recipients: Number(statsResult[0]?.recipients || 0),
    };

    res.json({ success: true, stats, users: alertUsers, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/alerts
router.post("/", async (req, res) => {
  const { title, message, alertType, selectedUsers } = req.body;
  if (!title || !message)
    return res.status(400).json({ success: false, message: "title and message are required" });
  try {
    // Get real patient count for broadcast
    const [[countRow]] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'patient'");
    const recipientCount =
      alertType === "broadcast" ? Number(countRow.total) :
      Array.isArray(selectedUsers) ? selectedUsers.length : 1;
    const recipient = alertType === "broadcast" ? "All Users" : `${recipientCount} user(s)`;
    const type      = alertType === "broadcast" ? "Broadcast" : recipientCount > 1 ? "High Priority" : "Normal";
    const sentAt    = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const [result] = await db.query(
      "INSERT INTO alert_history (title, message, recipient, recipient_count, type, status, sent_at, read_at) VALUES (?, ?, ?, ?, ?, 'Sent', ?, '-')",
      [title, message, recipient, recipientCount, type, sentAt]
    );

    const [rows] = await db.query(
      "SELECT id, title, message, recipient, recipient_count AS recipientCount, type, status, sent_at AS sentAt, read_at AS readAt FROM alert_history WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, message: "Alert sent successfully", data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

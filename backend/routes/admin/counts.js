const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/counts — lightweight badge counts for admin layout
router.get("/", async (_req, res) => {
  try {
    const [[severe], [alerts], [active]] = await Promise.all([
      // Severe cases: users who have Severe symptoms
      db.query(`
        SELECT COUNT(DISTINCT user_id) AS total
        FROM symptoms_history
        WHERE severity = 'Severe'
      `),
      // Pending alerts
      db.query(`
        SELECT COUNT(*) AS total FROM alert_history WHERE LOWER(status) = 'pending'
      `),
      // Active patients monitored (logged symptoms in last 7 days)
      db.query(`
        SELECT COUNT(DISTINCT user_id) AS total
        FROM symptoms_history
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `),
    ]);

    res.json({
      success: true,
      severeCases:    Number(severe[0]?.total  || 0),
      pendingAlerts:  Number(alerts[0]?.total  || 0),
      activePatients: Number(active[0]?.total  || 0),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

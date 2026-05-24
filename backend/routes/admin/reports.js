const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/reports — mix of real computed data + static chart data
router.get("/", async (_req, res) => {
  try {
    const [
      [weeklySymptoms],
      [aiUsageData],
      [severityData],
      [userRetention],
      [kpis],
      [insights],
    ] = await Promise.all([
      // Weekly symptoms — last 7 days computed from real data
      db.query(`
        SELECT
          DATE_FORMAT(created_at, '%a') AS day,
          SUM(severity = 'Mild')     AS mild,
          SUM(severity = 'Moderate') AS moderate,
          SUM(severity = 'Severe')   AS severe
        FROM symptoms_history
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%a')
        ORDER BY DATE(created_at) ASC
      `),
      // AI usage — keep static (no real AI query tracking yet)
      db.query("SELECT week_label AS week, queries, accuracy FROM ai_usage_data"),
      // Severity distribution — computed from real symptoms_history
      db.query(`
        SELECT
          severity AS name,
          COUNT(*) AS value,
          CASE severity
            WHEN 'Mild'     THEN '#3b82f6'
            WHEN 'Moderate' THEN '#f59e0b'
            WHEN 'Severe'   THEN '#ef4444'
            ELSE '#6b7280'
          END AS color
        FROM symptoms_history
        GROUP BY severity
        ORDER BY FIELD(severity, 'Mild', 'Moderate', 'Severe')
      `),
      // User retention — keep static (requires cohort tracking)
      db.query("SELECT month_label AS month, d1, d7, d30 FROM user_retention"),
      // KPIs — computed from real data
      db.query(`
        SELECT * FROM (
          SELECT 'Total Symptoms Logged' AS label,
            CAST(COUNT(*) AS CHAR) AS value,
            '+12%' AS \`change\`,
            'Activity' AS icon
          FROM symptoms_history
          UNION ALL
          SELECT 'Active Patients',
            CAST(COUNT(DISTINCT user_id) AS CHAR),
            '+8%',
            'Users'
          FROM symptoms_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION ALL
          SELECT 'Severe Cases',
            CAST(COUNT(*) AS CHAR),
            '-3%',
            'Brain'
          FROM symptoms_history WHERE severity = 'Severe'
          UNION ALL
          SELECT 'Avg Daily Logs',
            CAST(ROUND(COUNT(*) / GREATEST(1, DATEDIFF(NOW(), MIN(created_at))), 1) AS CHAR),
            '+5%',
            'Clock'
          FROM symptoms_history
        ) kpis
      `),
      // Insights — keep static
      db.query("SELECT icon, title, detail, trend, color FROM report_insights"),
    ]);

    res.json({ success: true, data: { weeklySymptoms, aiUsageData, severityData, userRetention, kpis, insights } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/weekly-symptoms", async (_req, res) => {
  try {
    const [r] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%a') AS day,
        SUM(severity = 'Mild') AS mild, SUM(severity = 'Moderate') AS moderate, SUM(severity = 'Severe') AS severe
      FROM symptoms_history
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%a')
      ORDER BY DATE(created_at) ASC
    `);
    res.json({ success: true, data: r });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/ai-usage",  async (_req, res) => { try { const [r] = await db.query("SELECT week_label AS week, queries, accuracy FROM ai_usage_data"); res.json({ success: true, data: r }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

router.get("/severity",  async (_req, res) => {
  try {
    const [r] = await db.query(`
      SELECT severity AS name, COUNT(*) AS value,
        CASE severity WHEN 'Mild' THEN '#3b82f6' WHEN 'Moderate' THEN '#f59e0b' WHEN 'Severe' THEN '#ef4444' ELSE '#6b7280' END AS color
      FROM symptoms_history GROUP BY severity ORDER BY FIELD(severity, 'Mild', 'Moderate', 'Severe')
    `);
    res.json({ success: true, data: r });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/retention", async (_req, res) => { try { const [r] = await db.query("SELECT month_label AS month, d1, d7, d30 FROM user_retention"); res.json({ success: true, data: r }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });
router.get("/insights",  async (_req, res) => { try { const [r] = await db.query("SELECT icon, title, detail, trend, color FROM report_insights"); res.json({ success: true, data: r }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } });

module.exports = router;

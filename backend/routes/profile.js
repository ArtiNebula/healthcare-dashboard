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

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    const userId = await getUserId(req);
    const [[profileRows], [wellness], [vitals], [emergencyContacts], [notifications]] = await Promise.all([
      db.query("SELECT name, email, phone, dob, blood_type AS bloodType, height, weight, allergies, conditions, join_date AS joinDate FROM user_profile WHERE user_id = ? LIMIT 1", [userId]),
      db.query("SELECT metric, value, full_mark AS fullMark FROM user_wellness WHERE user_id = ?", [userId]),
      db.query("SELECT label, value, status FROM user_vitals WHERE user_id = ?", [userId]),
      db.query("SELECT name, relation, phone FROM emergency_contacts WHERE user_id = ?", [userId]),
      db.query("SELECT pref_id AS id, label, enabled FROM notification_preferences WHERE user_id = ?", [userId]),
    ]);

    // If new user has no profile yet, return data from users table
    let profile = profileRows[0];
    if (!profile) {
      const [userRows] = await db.query("SELECT name, email FROM users WHERE id = ?", [userId]);
      profile = { name: userRows[0]?.name || "", email: userRows[0]?.email || "", phone: "", dob: "", bloodType: "", height: "", weight: "", allergies: "", conditions: "", joinDate: "" };
    }

    const notifs = notifications.map((n) => ({ ...n, enabled: !!n.enabled }));
    res.json({ success: true, data: { ...profile, wellness, vitals, emergencyContacts, notifications: notifs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  const colMap = {
    name: "name", email: "email", phone: "phone", dob: "dob",
    bloodType: "blood_type", height: "height", weight: "weight",
    allergies: "allergies", conditions: "conditions",
  };
  const updates = [];
  const values  = [];
  for (const [jsKey, dbCol] of Object.entries(colMap)) {
    if (req.body[jsKey] !== undefined) {
      updates.push(`${dbCol} = ?`);
      values.push(req.body[jsKey]);
    }
  }
  if (!updates.length)
    return res.status(400).json({ success: false, message: "No valid fields to update" });
  try {
    const userId = await getUserId(req);
    await db.query(`UPDATE user_profile SET ${updates.join(", ")} WHERE user_id = ?`, [...values, userId]);
    const [[profileRows]] = await db.query("SELECT name, email, phone, dob, blood_type AS bloodType, height, weight, allergies, conditions, join_date AS joinDate FROM user_profile WHERE user_id = ? LIMIT 1", [userId]);
    res.json({ success: true, message: "Profile updated successfully", data: profileRows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile/notifications
router.put("/notifications", async (req, res) => {
  const { id, enabled } = req.body;
  if (!id || enabled === undefined)
    return res.status(400).json({ success: false, message: "id and enabled are required" });
  try {
    const userId = await getUserId(req);
    await db.query("UPDATE notification_preferences SET enabled = ? WHERE pref_id = ? AND user_id = ?", [enabled ? 1 : 0, id, userId]);
    res.json({ success: true, message: "Notification preference updated", data: { id, enabled } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/change-password
router.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ success: false, message: "Both passwords are required" });
  try {
    const userId = await getUserId(req);
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (!rows.length || rows[0].password !== currentPassword)
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId]);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

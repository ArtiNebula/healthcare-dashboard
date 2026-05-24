const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);
    const user = rows[0];
    if (!user) {
      global.metricsCounters?.loginAttempts?.inc({ type: "user", result: "failure" });
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Support both bcrypt hashes and legacy plain-text passwords
    const isHashed = user.password.startsWith("$2");
    const valid = isHashed
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!valid) {
      global.metricsCounters?.loginAttempts?.inc({ type: "user", result: "failure" });
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Upgrade plain-text password to bcrypt hash on successful login
    if (!isHashed) {
      const hash = await bcrypt.hash(password, 10);
      await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
    }

    global.metricsCounters?.loginAttempts?.inc({ type: "user", result: "success" });
    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo: user.role === "admin" ? "/admin" : "/user",
    });
  } catch (err) {
    global.metricsCounters?.dbErrors?.inc();
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/admin-login
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND role = 'admin'",
      [email]
    );
    const user = rows[0];
    if (!user) {
      global.metricsCounters?.loginAttempts?.inc({ type: "admin", result: "failure" });
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const isHashed = user.password.startsWith("$2");
    const valid = isHashed
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!valid) {
      global.metricsCounters?.loginAttempts?.inc({ type: "admin", result: "failure" });
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    if (!isHashed) {
      const hash = await bcrypt.hash(password, 10);
      await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
    }

    global.metricsCounters?.loginAttempts?.inc({ type: "admin", result: "success" });
    res.json({
      success: true,
      message: "Admin login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo: "/admin",
    });
  } catch (err) {
    global.metricsCounters?.dbErrors?.inc();
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields are required" });
  try {
    const [exists] = await db.query("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", [email]);
    if (exists.length)
      return res.status(409).json({ success: false, message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'patient')", [
      name, email, hash,
    ]);
    global.metricsCounters?.userSignups?.inc();
    res.status(201).json({ success: true, message: "Account created successfully", redirectTo: "/user" });
  } catch (err) {
    global.metricsCounters?.dbErrors?.inc();
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email is required" });
  res.json({ success: true, message: `If ${email} is registered, a reset link has been sent.` });
});

module.exports = router;

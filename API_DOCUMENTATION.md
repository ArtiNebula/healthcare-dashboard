# HealthAI — Full Feature & API Documentation

## Tech Stack Overview

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL 8.0 |
| Cache | Redis (via ioredis) |
| Monitoring | Prometheus + Grafana |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Authentication Flow

```
User → Login Form → POST /api/auth/login → MySQL (users table) → JWT-less session via localStorage
```

---

# USER FEATURES

---

## 1. Home Page

**Frontend:** `src/app/pages/HomePage.tsx`
**API Called:** `GET /api/home`

### What the feature shows:
- Hero stats (total patients, accuracy, uptime)
- Live metrics (heart rate, symptoms logged, health trend, AI suggestions count)
- Feature cards (AI Analysis, Real-time Monitoring, etc.)
- Service status (API, Database, AI Engine)

### What happens inside the API:
```
GET /api/home
  ↓
MySQL: 4 parallel queries
  - home_hero_stats        → hero stat cards
  - home_live_metrics      → real-time numbers (heartRate, symptomsLogged, etc.)
  - home_features          → feature cards data
  - home_services          → service status list
  ↓
Response: { heroStats, liveMetrics, features, services }
```

**Also:** `PATCH /api/home/live-metrics` — admin update karne ke liye live metric values

---

## 2. Login Page

**Frontend:** `src/app/pages/LoginPage.tsx`
**APIs Called:**
- `POST /api/auth/login`

### What the feature shows:
- Email + Password form
- Error message on wrong credentials
- Redirects to `/user` (patient) or `/admin` (admin) based on role

### What happens inside the API:
```
POST /api/auth/login  { email, password }
  ↓
MySQL: SELECT * FROM users WHERE email = ?
  ↓
bcryptjs: compare(password, storedHash)
  ↓
If password stored as plain text → auto-upgrade to bcrypt hash
  ↓
Response: { user: {id, name, email, role}, redirectTo }
  ↓
Frontend: stores user in localStorage → navigates to redirectTo
```

**Prometheus Metrics Tracked:**
- `login_attempts_total{type="user", result="success/failure"}`

---

## 3. Signup Page

**Frontend:** `src/app/pages/SignupPage.tsx`
**API Called:** `POST /api/auth/signup`

### What the feature shows:
- Name, Email, Password form
- Password length validation (min 8 chars) — done on frontend
- On success → redirects to `/login`

### What happens inside the API:
```
POST /api/auth/signup  { name, email, password }
  ↓
MySQL: SELECT id FROM users WHERE email = ?  → check duplicate
  ↓
If exists → 409 Conflict
  ↓
bcryptjs.hash(password, 10)  → secure password
  ↓
MySQL: INSERT INTO users (name, email, password, role='patient')
  ↓
Response: { success: true, message: "Account created" }
```

**Prometheus Metrics Tracked:**
- `user_signups_total`

---

## 4. User Dashboard

**Frontend:** `src/app/pages/user/DashboardPage.tsx`
**APIs Called:**
- `GET /api/dashboard`
- `GET /api/profile` (to get user name if not in localStorage)

### What the feature shows:
- Health Score card (calculated from symptoms)
- Active Symptoms count
- Health trend line chart (7-21 days)
- Recent Symptoms (last 3)
- AI Suggestions cards
- Microservices status

### What happens inside the API:
```
GET /api/dashboard
  ↓
Redis Cache check → if hit, return cached (30 seconds TTL)
  ↓
If no cache, MySQL parallel queries:
  - dashboard_stats (per user)       → health score, active symptoms
  - If no stats → compute from symptoms_history:
      AVG(severity_score) → healthScore = 100 - avg*8
      COUNT active symptoms
  - health_trend                     → chart data
  - symptoms_history (last 3 rows)   → recent symptoms list
  - ai_suggestions (for user)        → AI suggestion cards
  - microservices table              → service status
  ↓
setCache(dashboard:{userId}, data, 30s)
  ↓
Response: { stats, healthTrend, recentSymptoms, aiSuggestions, microservices }
```

---

## 5. Add Symptoms Page ⭐

**Frontend:** `src/app/pages/user/AddSymptomsPage.tsx`
**API Called:** `POST /api/symptoms`

### What the feature shows:
- 6 symptom categories (Head & Neurological, Respiratory, Digestive, General, Cardiovascular, Mental Health)
- Multi-symptom selection with chips
- Severity slider (1–10 → mapped to Mild/Moderate/Severe)
- Temperature input, Duration input
- On submit → success message

### What happens inside the API:
```
POST /api/symptoms  { symptom, category, severity, temperature, duration }
  ↓
Header: X-User-Id or X-User-Email → resolve userId from MySQL
  ↓
Severity mapping:
  Severe   → severityScore = 8
  Moderate → severityScore = 5
  Mild     → severityScore = 3
  ↓
MySQL: INSERT INTO symptoms_history
  (user_id, date, symptoms JSON, severity, severity_score,
   status='Active', ai_note='AI analysis pending', duration, category, temperature)
  ↓
SELECT newly inserted row → return to frontend
  ↓
Response: { success: true, data: { id, date, symptoms, severity, status } }
```

**Prometheus Metrics Tracked:**
- `symptoms_logged_total` — har successful POST pe increment

---

## 6. Symptom History Page

**Frontend:** `src/app/pages/user/HistoryPage.tsx`
**APIs Called:**
- `GET /api/symptoms` — full history list
- `GET /api/symptoms/health-trend` — line chart data
- `GET /api/symptoms/frequency` — bar chart (top 6 symptoms)

### What the feature shows:
- Table/Timeline view of all logged symptoms
- Search + filter by status/severity
- Health Score trend chart (area chart)
- Symptom Frequency bar chart

### What happens inside the APIs:

```
GET /api/symptoms
  ↓
MySQL: SELECT from symptoms_history WHERE user_id = ? ORDER BY date DESC
  ↓
Response: list of all symptom entries

GET /api/symptoms/health-trend
  ↓
MySQL: GROUP BY DATE(created_at)
  score = MAX(0, 100 - AVG(severity_score) * 8)
  ↓
Response: [{ date, score, symptoms }]  ← 21 days max

GET /api/symptoms/frequency
  ↓
MySQL: JSON_EXTRACT(symptoms, '$[0]') → extract first symptom
  GROUP BY symptom → COUNT(*) DESC LIMIT 6
  ↓
Response: [{ symptom, count }]
```

---

## 7. AI Suggestion Page ⭐⭐ (Main AI Feature)

**Frontend:** `src/app/pages/user/AISuggestionPage.tsx`
**APIs Called:**
- `GET /api/ai/analysis` — main analysis data
- `POST /api/ai/feedback` — user feedback on recommendations

### What the feature shows:
- AI Confidence Score (e.g., 87%)
- Detected Conditions list (with severity, description, causes, treatments)
- Health Recommendations (high/medium/low priority)
- "When to See a Doctor" triggers
- Health trend sparkline
- Refresh button (re-fetches analysis)
- Thumbs up/down feedback on each recommendation

### What the AI Feature actually uses — Technology Explanation:

> **Important:** This is a **rule-based AI / pre-computed AI system**, not a live LLM call.

| Component | How it works |
|---|---|
| **AI Confidence Score** | Stored in `ai_analysis` table (e.g., 87%) — represents overall model confidence |
| **Detected Conditions** | Stored in `ai_conditions` table — pre-analyzed conditions with confidence %, severity, causes, treatments |
| **Recommendations** | Stored in `ai_recommendations` table — priority-based health advice |
| **Doctor Triggers** | Stored in `ai_doctor_triggers` table — warning signs that need medical attention |
| **Sparkline Data** | Stored in `ai_sparkline_data` table — 7-day health trend scores |

**Why this approach:**
The AI analysis runs offline/batch and results are stored in MySQL. The API simply fetches and serves this pre-computed data. This makes the system fast, reliable, and cost-effective.

### What happens inside the API:

```
GET /api/ai/analysis
  ↓
global.metricsCounters.aiAnalysisRequests.inc()   ← Prometheus counter
  ↓
Redis Cache check (key: "ai:analysis", TTL: 60s)
  ↓ If cache miss:
MySQL parallel queries (Promise.all):
  - ai_analysis         → confidence score
  - ai_conditions       → detected conditions (name, severity, description, causes, treatments)
  - ai_recommendations  → health advice (icon, title, detail, priority)
  - ai_sparkline_data   → 7-day score trend
  - ai_doctor_triggers  → warning signs (trigger text + urgency level)
  ↓
setCache("ai:analysis", data, 60s)
  ↓
Response: {
  confidence: 87,
  conditions: [...],
  recommendations: [...],
  sparklineData: [...],
  doctorTriggers: [...]
}
```

```
POST /api/ai/feedback  { conditionId, feedback: "helpful"/"not_helpful" }
  ↓
Validates fields present
  ↓
Response: { success: true, message: "Feedback recorded" }
(feedback noted but not stored in DB currently — can be extended)
```

**Prometheus Metrics Tracked:**
- `ai_analysis_requests_total`

**Cache Behavior:**
- First request → hits MySQL, caches for 60 seconds
- Next 60 seconds → served from Redis (near-zero latency)

---

## 8. Profile Page

**Frontend:** `src/app/pages/user/ProfilePage.tsx`
**APIs Called:**
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/notifications`
- `POST /api/profile/change-password`

### What the feature shows:
- Personal info (name, email, phone, DOB, blood type, height, weight)
- Wellness radar chart (5 metrics)
- Vitals cards (BP, Heart Rate, etc.)
- Emergency contacts
- Notification preferences toggles
- Change password form

### What happens inside the APIs:

```
GET /api/profile
  ↓
MySQL parallel queries:
  - user_profile          → personal info
  - user_wellness         → radar chart data
  - user_vitals           → vitals (BP, HR, etc.)
  - emergency_contacts    → contact list
  - notification_preferences → toggle settings
  ↓
If no profile found → fallback to users table (name, email)
  ↓
Response: { name, email, phone, bloodType, ..., wellness, vitals, emergencyContacts, notifications }

PUT /api/profile  { name, email, phone, dob, bloodType, ... }
  ↓
Dynamic SQL: only update provided fields
MySQL: UPDATE user_profile SET ... WHERE user_id = ?
  ↓
Response: updated profile

PUT /api/profile/notifications  { id, enabled: true/false }
  ↓
MySQL: UPDATE notification_preferences SET enabled = ? WHERE pref_id = ? AND user_id = ?

POST /api/profile/change-password  { currentPassword, newPassword }
  ↓
MySQL: SELECT password FROM users WHERE id = ?
Compare currentPassword → if wrong → 401
MySQL: UPDATE users SET password = newPassword WHERE id = ?
```

---

---

# ADMIN FEATURES

---

## 9. Admin Login

**Frontend:** `src/app/pages/AdminLoginPage.tsx`
**API Called:** `POST /api/auth/admin-login`

### What the feature shows:
- Separate login form for admin role
- Redirects to `/admin` on success

### What happens inside the API:
```
POST /api/auth/admin-login  { email, password }
  ↓
MySQL: SELECT * FROM users WHERE email = ? AND role = 'admin'
  ↓
If not found → 401 (not just wrong password, but not an admin)
  ↓
bcrypt.compare(password, hash) OR plain-text match
  ↓
Response: { user: {id, name, email, role: "admin"}, redirectTo: "/admin" }
```

**Prometheus Metrics Tracked:**
- `login_attempts_total{type="admin", result="success/failure"}`

---

## 10. Admin Dashboard

**Frontend:** `src/app/pages/admin/AdminDashboardPage.tsx`
**API Called:** `GET /api/admin/dashboard`

### What the feature shows:
- 4 stat cards: Total Patients, Symptoms Logged, Severe Cases, Active This Week
- User Growth bar chart (monthly)
- AI Queries by Hour area chart
- Services Health table (response time, uptime, requests/min)
- Recent Activity feed
- Symptom Frequency pie/bar chart

### What happens inside the API:
```
GET /api/admin/dashboard
  ↓
Real-time counts from MySQL:
  - COUNT users WHERE role='patient'           → Total Patients
  - COUNT symptoms_history                     → Symptoms Logged
  - COUNT symptoms WHERE severity='Severe'     → Severe Cases
  - COUNT DISTINCT user_id (last 7 days)       → Active This Week
  ↓
Chart data (parallel queries):
  - user_growth table         → monthly growth bar chart
  - ai_queries_by_hour table  → AI query heatmap by hour
  - services_health table     → service monitoring table
  - recent_activity table     → activity feed
  - symptoms_history GROUP BY symptom → top 6 frequent symptoms (computed)
  ↓
Response: { stats, userGrowth, aiQueriesByHour, servicesHealth, recentActivity, symptomFrequency }
```

---

## 11. User Monitoring Page

**Frontend:** `src/app/pages/admin/UserMonitoringPage.tsx`
**APIs Called:**
- `GET /api/admin/users` — patient list (with search + filter)
- `GET /api/admin/users/:id` — individual user detail

### What the feature shows:
- Table of all patients with health score, risk level, symptom count
- Search by name/email
- Filter by risk level (Critical/High/Medium/Low) and status
- Click user → view details

### What happens inside the API:
```
GET /api/admin/users?search=...&risk=High&status=Active
  ↓
Dynamic SQL JOIN:
  users
  LEFT JOIN user_profile    → blood type
  LEFT JOIN symptoms_history → symptom count
  LEFT JOIN user_wellness   → avg health score
  ↓
Risk Level computed by SQL CASE:
  symptoms >= 10 → Critical
  symptoms >= 5  → High
  symptoms >= 2  → Medium
  else           → Low
  ↓
Filter applied via subquery (if risk/status params provided)
  ↓
Response: { total, count, data: [{id, name, email, riskLevel, healthScore, symptoms, ...}] }
```

---

## 12. Reports Page

**Frontend:** `src/app/pages/admin/ReportsPage.tsx`
**API Called:** `GET /api/admin/reports`

### What the feature shows:
- KPI cards (Total Symptoms, Active Patients, Severe Cases, Avg Daily Logs)
- Weekly Symptoms stacked bar (Mild/Moderate/Severe by day)
- AI Usage trend chart (weekly queries + accuracy)
- Severity distribution donut chart
- User Retention table (D1/D7/D30)
- Key Insights cards

### What happens inside the API:
```
GET /api/admin/reports
  ↓
MySQL parallel queries:
  - Weekly symptoms (last 7 days):
      GROUP BY DATE → SUM(Mild), SUM(Moderate), SUM(Severe) per day
  - ai_usage_data table    → weekly AI queries + accuracy (static)
  - Severity distribution:
      GROUP BY severity → COUNT + color code
  - user_retention table   → D1/D7/D30 retention % (static)
  - KPIs (UNION query):
      Total Symptoms logged (COUNT)
      Active Patients last 30 days (COUNT DISTINCT)
      Severe Cases (COUNT WHERE severity='Severe')
      Avg Daily Logs (COUNT / days since first log)
  - report_insights table  → insight cards (static)
  ↓
Response: { weeklySymptoms, aiUsageData, severityData, userRetention, kpis, insights }
```

**Sub-endpoints also available:**
- `GET /api/admin/reports/weekly-symptoms`
- `GET /api/admin/reports/severity`
- `GET /api/admin/reports/ai-usage`
- `GET /api/admin/reports/retention`
- `GET /api/admin/reports/insights`

---

## 13. Alerts Page

**Frontend:** `src/app/pages/admin/AlertsPage.tsx`
**APIs Called:**
- `GET /api/admin/alerts` — alert list + stats
- `POST /api/admin/alerts` — send new alert

### What the feature shows:
- Alert stats (Total Sent, Delivered, Pending, Recipients)
- High-risk user list (for targeted alerts)
- Alert history table (filterable by status)
- Send Alert form (title, message, broadcast or targeted)

### What happens inside the API:
```
GET /api/admin/alerts?status=sent
  ↓
MySQL parallel queries:
  - alert_history stats:
      COUNT total, SUM sent, SUM pending
      COUNT patients → recipients
  - High-risk users:
      users JOIN symptoms_history WHERE severity='Severe'
      HAVING COUNT > 0 → severity label
  - alert_history list (filtered by status if provided)
  ↓
Response: { stats, users (high-risk), data (alert list) }

POST /api/admin/alerts  { title, message, alertType, selectedUsers }
  ↓
alertType = 'broadcast' → recipient = "All Users", count = total patients
alertType = 'targeted'  → recipient = "{n} user(s)", count = selectedUsers.length
  ↓
MySQL: INSERT INTO alert_history
  (title, message, recipient, recipient_count, type, status='Sent', sent_at)
  ↓
Response: { success: true, data: newly created alert }
```

---

## 14. Severe Cases Page

**Frontend:** `src/app/pages/admin/SevereCasesPage.tsx`
**APIs Called:**
- `GET /api/admin/severe-cases` — all severe patients
- `GET /api/admin/severe-cases/:id` — individual case
- `POST /api/admin/severe-cases/:id/send-alert` — send alert to patient

### What the feature shows:
- Stats: Critical count, High count, Contacted count, Avg Response Time
- Patient cards with risk score, symptom list, duration, last update
- "Send Alert" button per patient

### What happens inside the API:
```
GET /api/admin/severe-cases
  ↓
MySQL JOIN:
  users JOIN symptoms_history (WHERE severity='Severe')
  LEFT JOIN user_profile → phone number
  ↓
Per patient computed:
  COUNT(severe symptoms) >= 10 → Critical
  COUNT >= 5                   → High
  else                         → Moderate
  riskScore = MIN(100, count * 10)
  symptoms = GROUP_CONCAT of symptom names
  duration = MAX(DATEDIFF(NOW(), created_at)) days
  ↓
Response: { stats: {critical, high, contacted}, data: [...patients] }

POST /api/admin/severe-cases/:id/send-alert  { message }
  ↓
MySQL: SELECT user from users WHERE id = ?
  ↓
MySQL: INSERT INTO alert_history
  (title='Severe Case Alert', message, recipient=user.name,
   recipient_count=1, type='Critical', status='Sent')
  ↓
Response: { success: true, message: "Alert sent via Email, SMS, Push Notification" }
```

---

## 15. Admin Counts (Badge Numbers)

**Frontend:** All admin layout pages (sidebar badges)
**API Called:** `GET /api/admin/counts`

### What it does:
Lightweight endpoint — called to update badge numbers in admin sidebar.

```
GET /api/admin/counts
  ↓
MySQL 3 parallel queries:
  - COUNT DISTINCT user_id WHERE severity='Severe'           → severeCases
  - COUNT FROM alert_history WHERE status='pending'          → pendingAlerts
  - COUNT DISTINCT user_id (symptoms in last 7 days)         → activePatients
  ↓
Response: { severeCases: 3, pendingAlerts: 1, activePatients: 12 }
```

---

# SYSTEM / INFRASTRUCTURE APIs

## 16. Health Check

```
GET /api/health
↓
Response: { status: "ok", message: "Healthcare API running", timestamp: "..." }
```
Used by Docker healthchecks and monitoring tools.

---

## 17. Prometheus Metrics

```
GET /api/metrics
↓
prom-client Registry → renders all metrics in Prometheus text format
↓
Scraped by Prometheus every 15 seconds
```

**Metrics exposed:**

| Metric | Type | Description |
|---|---|---|
| `http_requests_total` | Counter | Total HTTP requests by method, route, status |
| `http_request_duration_seconds` | Histogram | Request latency with P50/P95/P99 buckets |
| `active_http_requests` | Gauge | Current in-flight requests |
| `symptoms_logged_total` | Counter | Total symptoms logged by patients |
| `ai_analysis_requests_total` | Counter | Total AI analysis page hits |
| `login_attempts_total` | Counter | Login attempts by type (user/admin) and result |
| `user_signups_total` | Counter | New user registrations |
| `cache_hits_total` | Counter | Redis cache hits |
| `cache_misses_total` | Counter | Redis cache misses |
| `db_errors_total` | Counter | Database errors across all routes |
| `process_cpu_seconds_total` | Counter | Node.js CPU usage (default metric) |
| `process_resident_memory_bytes` | Gauge | Node.js memory usage (default metric) |

---

# CACHING STRATEGY

| Route | Cache Key | TTL | When invalidated |
|---|---|---|---|
| `GET /api/ai/analysis` | `ai:analysis` | 60s | Auto-expire |
| `GET /api/ai/conditions` | `ai:conditions` | 60s | Auto-expire |
| `GET /api/ai/recommendations` | `ai:recommendations` | 60s | Auto-expire |
| `GET /api/dashboard` | `dashboard:{userId}` | 30s | Auto-expire |

**Cache miss flow:** Redis → MySQL → store in Redis → return to client

---

# USER AUTHENTICATION MODEL

No JWT is used. Authentication is **session-less** via localStorage:

```
Login → server validates → returns { user, redirectTo }
Frontend stores in localStorage:
  - localStorage["user"] = { id, name, email, role }
  - localStorage["userId"] = id

All protected API calls send:
  - Header: X-User-Id: 1       (preferred)
  - Header: X-User-Email: ...  (fallback)

Backend getUserId() helper:
  1. Check X-User-Id header → parse as int
  2. Else check X-User-Email → query MySQL
  3. Fallback → userId = 1
```

---

# DATABASE TABLES SUMMARY

| Table | Purpose |
|---|---|
| `users` | All users (patients + admins), bcrypt passwords |
| `user_profile` | Extended profile (phone, DOB, blood type, etc.) |
| `user_wellness` | Wellness radar chart data |
| `user_vitals` | Vitals (BP, HR, SpO2, etc.) |
| `emergency_contacts` | Emergency contact list per user |
| `notification_preferences` | Notification toggle settings |
| `symptoms_history` | All logged symptoms (JSON array + severity) |
| `dashboard_stats` | Pre-computed dashboard stat cards |
| `health_trend` | Health trend data for dashboard chart |
| `ai_suggestions` | AI suggestion cards per user |
| `ai_analysis` | AI confidence score |
| `ai_conditions` | Detected health conditions with details |
| `ai_recommendations` | Health advice with priority |
| `ai_sparkline_data` | 7-day sparkline trend data |
| `ai_doctor_triggers` | Warning signs to see a doctor |
| `microservices` | Service status monitoring |
| `alert_history` | All sent admin alerts |
| `home_hero_stats` | Home page hero numbers |
| `home_live_metrics` | Home page live metrics |
| `home_features` | Home page feature cards |
| `home_services` | Home page service status |

---

*Generated: May 2026 | HealthAI — M.Tech SEM IV Healthcare Dashboard Development*

-- ============================================================
--  Healthcare Dashboard — Full Reset + Seed
--  Drops everything, recreates with proper user_id columns,
--  and inserts default data for all 4 users.
--  Run: mysql -u root -p < backend/database/full_reset.sql
-- ============================================================

DROP DATABASE IF EXISTS healthcare_db;
CREATE DATABASE healthcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE healthcare_db;

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('patient','admin') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── DASHBOARD ───────────────────────────────────────────────
CREATE TABLE dashboard_stats (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  user_id  INT DEFAULT 1,
  label    VARCHAR(100),
  value    VARCHAR(50),
  icon     VARCHAR(50),
  color    VARCHAR(60),
  bg_color VARCHAR(60),
  status   VARCHAR(50)
);

CREATE TABLE health_trend (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  user_id   INT DEFAULT 1,
  day_label VARCHAR(10),
  value     INT
);

CREATE TABLE recent_symptoms (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT DEFAULT 1,
  symptom    VARCHAR(100),
  severity   VARCHAR(50),
  date_label VARCHAR(50),
  time_label VARCHAR(50)
);

CREATE TABLE ai_suggestions (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  user_id  INT DEFAULT 1,
  text     TEXT,
  priority VARCHAR(20)
);

CREATE TABLE microservices (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100),
  status        VARCHAR(50),
  response_time VARCHAR(20)
);

-- ─── SYMPTOMS HISTORY ────────────────────────────────────────
CREATE TABLE symptoms_history (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  user_id        INT DEFAULT 1,
  date           VARCHAR(30),
  symptoms       JSON,
  severity       VARCHAR(50),
  severity_score INT,
  status         VARCHAR(50),
  ai_note        TEXT,
  duration       VARCHAR(50),
  category       VARCHAR(100),
  temperature    DECIMAL(5,2),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_score_trend (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  user_id        INT DEFAULT 1,
  date_label     VARCHAR(20),
  score          INT,
  symptoms_count INT
);

CREATE TABLE symptom_frequency (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT 1,
  symptom VARCHAR(100),
  count   INT
);

-- ─── AI ANALYSIS ─────────────────────────────────────────────
CREATE TABLE ai_analysis (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  confidence INT
);

CREATE TABLE ai_conditions (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200),
  confidence  INT,
  severity    VARCHAR(50),
  color       VARCHAR(50),
  description TEXT,
  urgency     VARCHAR(50),
  causes      JSON,
  treatments  JSON
);

CREATE TABLE ai_recommendations (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  icon       VARCHAR(10),
  title      VARCHAR(100),
  detail     TEXT,
  priority   VARCHAR(20),
  time_label VARCHAR(50)
);

CREATE TABLE ai_sparkline_data (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  day_label VARCHAR(10),
  score     INT
);

CREATE TABLE ai_doctor_triggers (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  trigger_text TEXT,
  urgency      VARCHAR(50)
);

-- ─── USER PROFILE ────────────────────────────────────────────
CREATE TABLE user_profile (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT DEFAULT 1,
  name       VARCHAR(100),
  email      VARCHAR(150),
  phone      VARCHAR(50),
  dob        VARCHAR(20),
  blood_type VARCHAR(10),
  height     VARCHAR(20),
  weight     VARCHAR(20),
  allergies  VARCHAR(200),
  conditions VARCHAR(200),
  join_date  VARCHAR(50)
);

CREATE TABLE user_wellness (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  user_id   INT DEFAULT 1,
  metric    VARCHAR(50),
  value     INT,
  full_mark INT
);

CREATE TABLE user_vitals (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT 1,
  label   VARCHAR(100),
  value   VARCHAR(50),
  status  VARCHAR(50)
);

CREATE TABLE emergency_contacts (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  user_id  INT DEFAULT 1,
  name     VARCHAR(100),
  relation VARCHAR(50),
  phone    VARCHAR(50)
);

CREATE TABLE notification_preferences (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT 1,
  pref_id VARCHAR(50),
  label   VARCHAR(200),
  enabled TINYINT(1) DEFAULT 1
);

-- ─── ADMIN ───────────────────────────────────────────────────
CREATE TABLE admin_users (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100),
  email        VARCHAR(150),
  status       VARCHAR(20),
  role         VARCHAR(50),
  symptoms     INT,
  risk_level   VARCHAR(20),
  last_login   VARCHAR(50),
  health_score INT,
  joined_date  VARCHAR(20)
);

CREATE TABLE weekly_symptoms (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  day_label VARCHAR(10),
  mild INT, moderate INT, severe INT
);

CREATE TABLE ai_usage_data (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  week_label VARCHAR(20),
  queries    INT,
  accuracy   INT
);

CREATE TABLE severity_data (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  value INT,
  color VARCHAR(20)
);

CREATE TABLE user_retention (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  month_label VARCHAR(10),
  d1 INT, d7 INT, d30 INT
);

CREATE TABLE report_kpis (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  label      VARCHAR(100),
  value      VARCHAR(50),
  change_pct VARCHAR(20),
  icon       VARCHAR(50)
);

CREATE TABLE report_insights (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  icon  VARCHAR(10),
  title VARCHAR(100),
  detail TEXT,
  trend  VARCHAR(100),
  color  VARCHAR(100)
);

CREATE TABLE severe_cases (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100),
  email       VARCHAR(150),
  phone       VARCHAR(50),
  severity    VARCHAR(20),
  risk_score  DECIMAL(4,1),
  symptoms    JSON,
  duration    VARCHAR(20),
  last_update VARCHAR(50),
  alerts_sent INT DEFAULT 0,
  status      VARCHAR(50)
);

CREATE TABLE alert_history (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         INT DEFAULT NULL,
  title           VARCHAR(200),
  message         TEXT,
  recipient       VARCHAR(100),
  recipient_count INT,
  type            VARCHAR(50),
  status          VARCHAR(20),
  sent_at         VARCHAR(50),
  read_at         VARCHAR(50)
);

CREATE TABLE alert_stats (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  total_sent INT,
  delivered  INT,
  pending    INT,
  recipients INT
);

CREATE TABLE alert_users (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  name     VARCHAR(100),
  severity VARCHAR(20)
);

CREATE TABLE admin_dashboard_stats (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  label      VARCHAR(100),
  value      VARCHAR(50),
  change_val VARCHAR(20),
  trend      VARCHAR(10)
);

CREATE TABLE user_growth (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  month_label VARCHAR(10),
  total INT, active INT
);

CREATE TABLE ai_queries_by_hour (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  hour_label VARCHAR(10),
  queries    INT
);

CREATE TABLE services_health (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  name             VARCHAR(100),
  icon             VARCHAR(50),
  response_time    VARCHAR(20),
  uptime           VARCHAR(20),
  requests_per_min INT,
  status           VARCHAR(20)
);

CREATE TABLE recent_activity (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  time_label VARCHAR(50),
  event      TEXT,
  severity   VARCHAR(20)
);

CREATE TABLE symptom_freq_admin (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  symptom VARCHAR(100),
  count   INT,
  pct     INT
);

CREATE TABLE home_hero_stats (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  value VARCHAR(50),
  label VARCHAR(100),
  color VARCHAR(50)
);

CREATE TABLE home_live_metrics (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  heart_rate      INT,
  symptoms_logged INT,
  health_trend    VARCHAR(50),
  ai_suggestions  INT
);

CREATE TABLE home_features (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  icon        VARCHAR(50),
  title       VARCHAR(100),
  description TEXT,
  color       VARCHAR(100)
);

CREATE TABLE home_services (
  id     INT PRIMARY KEY AUTO_INCREMENT,
  name   VARCHAR(100),
  status VARCHAR(20),
  uptime VARCHAR(20)
);

-- ============================================================
--  SEED DATA
-- ============================================================

-- ─── USERS ───────────────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES
  ('John Doe',   'john.doe@example.com',   'password123', 'patient'),
  ('Jane Smith', 'jane.smith@example.com', 'password123', 'patient'),
  ('Admin User', 'admin@hospital.com',     'admin123',    'admin'),
  ('Dr. Admin',  'dr.admin@hospital.com',  'admin123',    'admin');

-- ─── DASHBOARD STATS (user 1 & 2) ────────────────────────────
INSERT INTO dashboard_stats (user_id, label, value, icon, color, bg_color, status) VALUES
  (1,'Heart Rate',      '72 bpm','Heart',       'bg-red-500',    'bg-red-50',    'normal'),
  (1,'Daily Steps',     '8,542', 'Activity',    'bg-blue-500',   'bg-blue-50',   'active'),
  (1,'Health Score',    '85%',   'TrendingUp',  'bg-green-500',  'bg-green-50',  'good'),
  (1,'Active Symptoms', '2',     'AlertCircle', 'bg-orange-500', 'bg-orange-50', 'monitoring'),
  (2,'Heart Rate',      '68 bpm','Heart',       'bg-red-500',    'bg-red-50',    'normal'),
  (2,'Daily Steps',     '6,210', 'Activity',    'bg-blue-500',   'bg-blue-50',   'active'),
  (2,'Health Score',    '78%',   'TrendingUp',  'bg-green-500',  'bg-green-50',  'good'),
  (2,'Active Symptoms', '1',     'AlertCircle', 'bg-orange-500', 'bg-orange-50', 'monitoring');

-- ─── HEALTH TREND (user 1 & 2) ───────────────────────────────
INSERT INTO health_trend (user_id, day_label, value) VALUES
  (1,'Mon',72),(1,'Tue',68),(1,'Wed',75),(1,'Thu',70),(1,'Fri',73),(1,'Sat',71),(1,'Sun',74),
  (2,'Mon',65),(2,'Tue',70),(2,'Wed',68),(2,'Thu',72),(2,'Fri',75),(2,'Sat',74),(2,'Sun',78);

-- ─── RECENT SYMPTOMS (user 1 & 2) ───────────────────────────────
INSERT INTO recent_symptoms (user_id, symptom, severity, date_label, time_label) VALUES
  (1,'Headache',           'Mild',     'Today',      '9:30 AM'),
  (1,'Fatigue',            'Moderate', 'Today',      '11:00 AM'),
  (1,'Cough',              'Mild',     'Yesterday',  '3:15 PM'),
  (1,'Fever',              'Severe',   'Yesterday',  '8:00 PM'),
  (1,'Sore Throat',        'Mild',     '2 days ago', '10:45 AM'),
  (1,'Dizziness',          'Moderate', '2 days ago', '2:30 PM'),
  (2,'Back Pain',          'Moderate', 'Today',      '8:00 AM'),
  (2,'Nausea',             'Mild',     'Today',      '1:00 PM'),
  (2,'Shortness of Breath','Severe',   'Yesterday',  '5:30 PM'),
  (2,'Chest Pain',         'Moderate', '2 days ago', '9:00 AM');

-- ─── AI SUGGESTIONS (user 1 & 2) ─────────────────────────────
INSERT INTO ai_suggestions (user_id, text, priority) VALUES
  (1,'Consider staying hydrated to help with headaches',             'high'),
  (1,'Your symptoms may indicate stress - try relaxation techniques','medium'),
  (1,'Schedule a checkup if symptoms persist for more than 3 days', 'low'),
  (2,'Maintain regular sleep schedule to improve energy levels',     'high'),
  (2,'Light exercise can help reduce fatigue and improve mood',      'medium'),
  (2,'Monitor your blood pressure weekly',                           'low');

-- ─── MICROSERVICES ───────────────────────────────────────────
INSERT INTO microservices (name, status, response_time) VALUES
  ('Auth Service','operational','12ms'),
  ('AI Engine',   'operational','45ms'),
  ('Data Sync',   'operational','28ms');

-- ─── SYMPTOMS HISTORY (user 1) ───────────────────────────────
INSERT INTO symptoms_history (user_id, date, symptoms, severity, severity_score, status, ai_note, duration, category, created_at) VALUES
  (1,'2026-04-16','["Headache","Fatigue"]',  'Moderate',6,'Active',  'Possible tension headache',   '2 hrs',  'Neurological', '2026-04-16 09:00:00'),
  (1,'2026-04-10','["Fatigue"]',             'Mild',    3,'Active',  'Rest recommended',            '18 hrs', 'General',      '2026-04-10 08:00:00'),
  (1,'2026-04-07','["Cough","Sore Throat"]', 'Mild',    4,'Resolved','Viral throat infection',      '3 days', 'Respiratory',  '2026-04-07 10:00:00'),
  (1,'2026-04-05','["Fever","Body Ache"]',   'Severe',  8,'Resolved','Flu-like symptoms monitored', '2 days', 'General',      '2026-04-05 07:00:00'),
  (1,'2026-04-03','["Sore Throat"]',         'Mild',    3,'Resolved','Mild pharyngitis',            '1 day',  'Respiratory',  '2026-04-03 11:00:00'),
  (1,'2026-04-01','["Nausea","Dizziness"]',  'Moderate',5,'Resolved','Possible dehydration',        '6 hrs',  'Digestive',    '2026-04-01 14:00:00'),
  (1,'2026-03-28','["Headache"]',            'Mild',    3,'Resolved','Tension headache resolved',   '4 hrs',  'Neurological', '2026-03-28 15:00:00'),
  (1,'2026-03-20','["Back Pain"]',           'Moderate',5,'Resolved','Muscle tension - rest advised','3 days','Musculoskeletal','2026-03-20 09:00:00'),
  (1,'2026-03-10','["Fever","Cough"]',       'Severe',  8,'Resolved','Upper respiratory infection', '5 days', 'Respiratory',  '2026-03-10 08:00:00');

-- ─── SYMPTOMS HISTORY (user 2) ───────────────────────────────
INSERT INTO symptoms_history (user_id, date, symptoms, severity, severity_score, status, ai_note, duration, category, created_at) VALUES
  (2,'2026-04-15','["Fatigue","Dizziness"]', 'Mild',    3,'Active',  'Monitor hydration levels',    '1 day',  'General',      '2026-04-15 09:00:00'),
  (2,'2026-04-08','["Headache"]',            'Mild',    3,'Resolved','Stress-related headache',     '4 hrs',  'Neurological', '2026-04-08 10:00:00'),
  (2,'2026-03-25','["Cough","Fever"]',       'Moderate',6,'Resolved','Seasonal flu symptoms',       '4 days', 'Respiratory',  '2026-03-25 08:00:00');

-- ─── HEALTH SCORE TREND (user 1 & 2) ─────────────────────────
INSERT INTO health_score_trend (user_id, date_label, score, symptoms_count) VALUES
  (1,'Mar 22',62,4),(1,'Mar 25',58,5),(1,'Mar 28',65,3),
  (1,'Apr 01',70,2),(1,'Apr 03',68,3),(1,'Apr 05',74,2),
  (1,'Apr 07',72,2),(1,'Apr 09',78,1),(1,'Apr 12',85,1),
  (2,'Mar 25',70,2),(2,'Apr 01',74,1),(2,'Apr 08',78,1),(2,'Apr 15',80,1);

-- ─── SYMPTOM FREQUENCY (user 1 & 2) ─────────────────────────
INSERT INTO symptom_frequency (user_id, symptom, count) VALUES
  (1,'Headache',3),(1,'Fatigue',2),(1,'Cough',2),(1,'Fever',2),(1,'Nausea',1),
  (2,'Fatigue',2),(2,'Headache',1),(2,'Cough',1);

-- ─── AI ANALYSIS ─────────────────────────────────────────────
INSERT INTO ai_analysis (confidence) VALUES (87);

INSERT INTO ai_conditions (name, confidence, severity, color, description, urgency, causes, treatments) VALUES
  ('Tension Headache',87,'Low','blue',
   'A common headache type causing mild to moderate pain around the head.',
   'Low',
   '["Stress and anxiety","Poor posture","Eye strain","Dehydration","Lack of sleep"]',
   '["Over-the-counter pain relievers","Rest in quiet room","Cold/warm compress","Stay hydrated"]'),
  ('Viral Fatigue Syndrome',74,'Medium','yellow',
   'Post-viral fatigue characterized by persistent tiredness not relieved by rest.',
   'Medium',
   '["Recent viral infection","Immune system response","Sleep disruption","Nutritional deficiencies"]',
   '["Adequate rest (7-9 hours)","Gradual return to activity","Balanced nutrition","Hydration"]'),
  ('Stress-Related Disorder',61,'Medium','orange',
   'Physical manifestation of chronic stress causing headaches, fatigue, and body tension.',
   'Low',
   '["Work/life stress","Anxiety","Poor sleep quality","Lifestyle factors"]',
   '["Relaxation techniques","Regular exercise","Counseling/Therapy","Stress management"]');

INSERT INTO ai_recommendations (icon, title, detail, priority, time_label) VALUES
  ('💧','Hydration',        'Drink 8-10 glasses of water daily. Dehydration triggers headaches.','high',  'Immediate'),
  ('😴','Sleep Hygiene',    'Consistent sleep schedule. Aim 7-8 hours per night.',               'high',  'Tonight'),
  ('🧘','Stress Management','10 minutes deep breathing or meditation daily.',                     'medium','Daily'),
  ('🥗','Nutrition',        'Do not skip meals. Low blood sugar triggers headaches.',             'medium','Ongoing'),
  ('🏃','Light Exercise',   '20-minute walk boosts mood and reduces headache frequency.',         'low',   'This week'),
  ('📱','Screen Breaks',    '20-20-20 rule: every 20 min, look 20 feet away for 20 seconds.',   'low',   'Daily');

INSERT INTO ai_sparkline_data (day_label, score) VALUES
  ('D1',65),('D2',62),('D3',68),('D4',70),('D5',67),('D6',72),('D7',69),
  ('D8',74),('D9',71),('D10',76),('D11',78),('D12',75),('D13',80),('D14',82);

INSERT INTO ai_doctor_triggers (trigger_text, urgency) VALUES
  ('Fever exceeds 103°F (39.4°C)',                         'Immediate'),
  ('Symptoms persist more than 5 days without improvement', 'Within 24h'),
  ('Severe or sudden worsening headache',                   'Immediate'),
  ('Headache with stiff neck or light sensitivity',         'Emergency'),
  ('Difficulty breathing or chest pain',                    'Emergency');

-- ─── USER PROFILE (user 1 & 2) ───────────────────────────────
INSERT INTO user_profile (user_id, name, email, phone, dob, blood_type, height, weight, allergies, conditions, join_date) VALUES
  (1,'John Doe',  'john.doe@example.com',  '+1 (555) 123-4567','1990-03-15','O+', '5''10"','168 lbs','Penicillin, Pollen',   'Mild Hypertension','January 2026'),
  (2,'Jane Smith','jane.smith@example.com','+1 (555) 987-6543','1992-07-22','A+', '5''6"', '135 lbs','Sulfa Drugs',          'None',             'February 2026');

INSERT INTO user_wellness (user_id, metric, value, full_mark) VALUES
  (1,'Sleep',75,100),(1,'Nutrition',60,100),(1,'Exercise',55,100),(1,'Hydration',80,100),(1,'Stress',65,100),(1,'Mental',70,100),
  (2,'Sleep',80,100),(2,'Nutrition',70,100),(2,'Exercise',65,100),(2,'Hydration',85,100),(2,'Stress',70,100),(2,'Mental',75,100);

INSERT INTO user_vitals (user_id, label, value, status) VALUES
  (1,'Heart Rate',    '72 bpm', 'normal'),(1,'Blood Pressure','118/76','normal'),(1,'Blood Type','O+','info'),(1,'Weight','168 lbs','normal'),
  (2,'Heart Rate',    '68 bpm', 'normal'),(2,'Blood Pressure','112/72','normal'),(2,'Blood Type','A+','info'),(2,'Weight','135 lbs','normal');

INSERT INTO emergency_contacts (user_id, name, relation, phone) VALUES
  (1,'Jane Doe',    'Spouse',            '+1 (555) 234-5678'),
  (1,'Dr. Smith',   'Primary Physician', '+1 (555) 345-6789'),
  (2,'Mark Smith',  'Spouse',            '+1 (555) 456-7890'),
  (2,'Dr. Johnson', 'Primary Physician', '+1 (555) 567-8901');

INSERT INTO notification_preferences (user_id, pref_id, label, enabled) VALUES
  (1,'symptom_reminders','Daily symptom reminders',1),(1,'ai_suggestions','AI health suggestions',1),(1,'critical_alerts','Critical health alerts',1),(1,'weekly_reports','Weekly health reports',0),
  (2,'symptom_reminders','Daily symptom reminders',1),(2,'ai_suggestions','AI health suggestions',1),(2,'critical_alerts','Critical health alerts',1),(2,'weekly_reports','Weekly health reports',1);

-- ─── ADMIN USERS ─────────────────────────────────────────────
INSERT INTO admin_users (name, email, status, role, symptoms, risk_level, last_login, health_score, joined_date) VALUES
  ('John Doe',      'john.doe@example.com',  'Active',  'Patient', 9, 'Low',     '2 hours ago', 85,'Jan 2026'),
  ('Jane Smith',    'jane.smith@example.com','Active',  'Patient', 3, 'Low',     '1 day ago',   78,'Feb 2026'),
  ('Mike Johnson',  'mike.j@example.com',    'Inactive','Patient', 5, 'Medium',  '1 week ago',  62,'Jan 2026'),
  ('Sarah Williams','sarah.w@example.com',   'Active',  'Patient',15, 'High',    '30 min ago',  45,'Mar 2026'),
  ('Tom Brown',     'tom.brown@example.com', 'Active',  'Patient', 6, 'Low',     '3 hours ago', 90,'Feb 2026'),
  ('Emma Davis',    'emma.d@example.com',    'Inactive','Patient', 3, 'Low',     '2 weeks ago', 71,'Mar 2026'),
  ('Robert Wilson', 'robert.w@example.com',  'Active',  'Patient',22, 'Critical','1 hour ago',  28,'Dec 2025'),
  ('Emily Martinez','emily.m@example.com',   'Active',  'Patient',18, 'Critical','4 hours ago', 32,'Jan 2026');

-- ─── ADMIN REPORTS ───────────────────────────────────────────
INSERT INTO weekly_symptoms (day_label, mild, moderate, severe) VALUES
  ('Mon',25,12,8),('Tue',30,15,7),('Wed',35,18,8),('Thu',28,14,6),('Fri',32,16,7),('Sat',22,10,6),('Sun',18,8,6);

INSERT INTO ai_usage_data (week_label, queries, accuracy) VALUES
  ('Week 1',320,82),('Week 2',480,84),('Week 3',560,86),('Week 4',720,87);

INSERT INTO severity_data (name, value, color) VALUES
  ('Mild',450,'#3b82f6'),('Moderate',280,'#f59e0b'),('Severe',120,'#ef4444');

INSERT INTO user_retention (month_label, d1, d7, d30) VALUES
  ('Nov',85,62,45),('Dec',88,65,48),('Jan',90,68,52),('Feb',87,70,55),('Mar',92,74,58),('Apr',94,78,62);

INSERT INTO report_kpis (label, value, change_pct, icon) VALUES
  ('Total Symptoms','850',   '+12%','Activity'),
  ('AI Queries',    '2,080', '+28%','Brain'),
  ('Active Users',  '892',   '+8%', 'Users'),
  ('Avg Response',  '18 min','-22%','Clock');

INSERT INTO report_insights (icon, title, detail, trend, color) VALUES
  ('🕐','Peak Usage Time',    'Most symptoms logged between 6 PM – 10 PM',     '+18% evenings',  'bg-blue-50 border-blue-200'),
  ('🤖','AI Accuracy Rate',   '87% user-validated accuracy on AI suggestions',  '+5% this month', 'bg-purple-50 border-purple-200'),
  ('💊','Avg Resolution Time','Symptoms resolve on avg in 3.2 days',            '-0.4 days',      'bg-green-50 border-green-200'),
  ('📊','Daily Active Users', '72% of registered users log symptoms weekly',    '+8% engagement', 'bg-orange-50 border-orange-200'),
  ('🏥','Critical Cases',     '2.4% of cases escalated to emergency care',      '-0.3% reduction','bg-red-50 border-red-200'),
  ('🔔','Alert Response',     'Admin responds to critical alerts avg in 18 min','-4 min faster',  'bg-indigo-50 border-indigo-200');

-- ─── SEVERE CASES ────────────────────────────────────────────
INSERT INTO severe_cases (name, email, phone, severity, risk_score, symptoms, duration, last_update, alerts_sent, status) VALUES
  ('Robert Wilson', 'robert.w@example.com','+1 234-567-8901','Critical',8.5,'["High Fever (102F)","Chest Pain","Shortness of Breath","Fatigue"]','3 days','2 hours ago',2,'Uncontacted'),
  ('Emily Martinez','emily.m@example.com', '+1 234-567-8902','Critical',8.2,'["Severe Headache","Blurred Vision","Dizziness","Nausea"]',          '2 days','4 hours ago',1,'Contacted'),
  ('David Thompson','david.t@example.com', '+1 234-567-8903','High',    7.8,'["Persistent Cough","Chest Tightness","High Fever","Body Ache"]',   '4 days','6 hours ago',3,'Under Observation'),
  ('Maria Garcia',  'maria.g@example.com', '+1 234-567-8904','High',    7.5,'["Abdominal Pain","Vomiting","High Fever","Dehydration"]',           '1 day', '1 hour ago', 0,'Uncontacted'),
  ('James Anderson','james.a@example.com', '+1 234-567-8905','High',    7.3,'["Difficulty Breathing","Rapid Heart Rate","Anxiety","Sweating"]',  '5 days','3 hours ago',2,'Contacted');

-- ─── ALERTS ──────────────────────────────────────────────────
INSERT INTO alert_history (user_id, title, message, recipient, recipient_count, type, status, sent_at, read_at) VALUES
  (NULL,'Emergency Health Advisory',      'Please visit the emergency room immediately.','Robert Wilson', 1,  'Critical',     'Sent',   '2 hours ago', '1 hour ago'),
  (NULL,'Follow-up Appointment',          'Your symptoms require a follow-up consultation.','All High Risk',5,'High Priority','Sent',   '5 hours ago', '4 hours ago'),
  (NULL,'Medication Reminder',            'Take your prescribed medication as scheduled.','Emily Martinez',1, 'Normal',       'Sent',   '1 day ago',   '1 day ago'),
  (NULL,'System Maintenance Notice',      'Platform maintenance Sunday 2 AM - 4 AM.','All Users',       892,'Broadcast',    'Pending','Not sent yet', '-'),
  (NULL,'Health Checkup Recommendation',  'We recommend a comprehensive checkup.','David Thompson',    1,  'Normal',       'Sent',   '2 days ago',  '2 days ago');

INSERT INTO alert_stats (total_sent, delivered, pending, recipients) VALUES (1247, 1189, 58, 892);

INSERT INTO alert_users (name, severity) VALUES
  ('Robert Wilson', 'Critical'),('Emily Martinez','Critical'),
  ('David Thompson','High'),    ('Maria Garcia',  'High'),('James Anderson','High');

-- ─── ADMIN DASHBOARD ─────────────────────────────────────────
INSERT INTO admin_dashboard_stats (label, value, change_val, trend) VALUES
  ('Total Users',    '892',  '+12%','up'),
  ('Active Today',   '348',  '+8%', 'up'),
  ('AI Queries',     '2,081','+28%','up'),
  ('Critical Alerts','7',    '-3',  'down');

INSERT INTO user_growth (month_label, total, active) VALUES
  ('Nov',620,410),('Dec',698,450),('Jan',745,490),('Feb',800,530),('Mar',856,570),('Apr',892,610);

INSERT INTO ai_queries_by_hour (hour_label, queries) VALUES
  ('6am',12),('8am',45),('10am',78),('12pm',95),('2pm',88),('4pm',102),('6pm',145),('8pm',168),('10pm',120);

INSERT INTO services_health (name, icon, response_time, uptime, requests_per_min, status) VALUES
  ('Auth Service',  'Shield',  '12ms','99.99%',245,'online'),
  ('AI Engine',     'Brain',   '45ms','99.95%', 89,'online'),
  ('Notify Service','Bell',    '28ms','99.97%',156,'online'),
  ('Data Sync',     'Database','18ms','99.98%',312,'online'),
  ('API Gateway',   'Globe',   '8ms', '99.99%',892,'online');

INSERT INTO recent_activity (time_label, event, severity) VALUES
  ('2 min ago', 'Robert Wilson logged critical symptoms',          'critical'),
  ('8 min ago', 'AI Engine flagged high-risk pattern for user #7', 'high'),
  ('15 min ago','Emily Martinez contacted by admin',               'medium'),
  ('22 min ago','New user registration: Tom Brown',                'low'),
  ('1 hr ago',  'Weekly health report generated',                  'info');

INSERT INTO symptom_freq_admin (symptom, count, pct) VALUES
  ('Headache',124,75),('Fatigue',98,60),('Fever',76,46),('Cough',65,40),('Chest Pain',32,19);

-- ─── HOME PAGE ───────────────────────────────────────────────
INSERT INTO home_hero_stats (value, label, color) VALUES
  ('99.9%','Uptime SLA',   'text-indigo-600'),
  ('24/7', 'AI Monitoring','text-purple-600'),
  ('HIPAA','Compliant',    'text-pink-600');

INSERT INTO home_live_metrics (heart_rate, symptoms_logged, health_trend, ai_suggestions)
  VALUES (72, 3, 'Improving', 2);

INSERT INTO home_features (icon, title, description, color) VALUES
  ('Activity','Symptom Tracking','Log and track your health symptoms with ease',       'from-blue-500 to-cyan-500'),
  ('Brain',   'AI Suggestions',  'Get intelligent health insights powered by AI',      'from-purple-500 to-pink-500'),
  ('FileText','Health History',  'Access your complete medical history anytime',       'from-orange-500 to-red-500');

INSERT INTO home_services (name, status, uptime) VALUES
  ('Auth Service',  'Active','99.99%'),
  ('AI Service',    'Active','99.95%'),
  ('Data Service',  'Active','99.98%'),
  ('Notify Service','Active','99.97%');

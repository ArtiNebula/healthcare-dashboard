-- ============================================================
--  Healthcare Dashboard — Seed Data
--  Run AFTER schema.sql:
--  mysql -u root -p healthcare_db < backend/database/seed.sql
-- ============================================================

USE healthcare_db;

-- ─── USERS ───────────────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES
  ('John Doe',   'john.doe@example.com',   'password123', 'patient'),
  ('Jane Smith', 'jane.smith@example.com', 'password123', 'patient'),
  ('Admin User', 'admin@hospital.com',     'admin123',    'admin'),
  ('Dr. Admin',  'dr.admin@hospital.com',  'admin123',    'admin');

-- ─── DASHBOARD STATS ─────────────────────────────────────────
INSERT INTO dashboard_stats (label, value, icon, color, bg_color, status) VALUES
  ('Heart Rate',      '72 bpm', 'Heart',       'bg-red-500',    'bg-red-50',    'normal'),
  ('Daily Steps',     '8,542',  'Activity',    'bg-blue-500',   'bg-blue-50',   'active'),
  ('Health Score',    '85%',    'TrendingUp',  'bg-green-500',  'bg-green-50',  'good'),
  ('Active Symptoms', '2',      'AlertCircle', 'bg-orange-500', 'bg-orange-50', 'monitoring');

-- ─── HEALTH TREND ────────────────────────────────────────────
INSERT INTO health_trend (day_label, value) VALUES
  ('Mon', 72), ('Tue', 68), ('Wed', 75),
  ('Thu', 70), ('Fri', 73), ('Sat', 71), ('Sun', 74);

-- ─── RECENT SYMPTOMS ─────────────────────────────────────────
INSERT INTO recent_symptoms (symptom, severity, date_label, time_label) VALUES
  ('Headache', 'Moderate', 'Today',      '2h ago'),
  ('Fatigue',  'Mild',     'Yesterday',  '18h ago'),
  ('Cough',    'Mild',     '2 days ago', '2d ago');

-- ─── AI SUGGESTIONS ──────────────────────────────────────────
INSERT INTO ai_suggestions (text, priority) VALUES
  ('Consider staying hydrated to help with headaches',                       'high'),
  ('Your symptoms may indicate stress - try relaxation techniques',          'medium'),
  ('Schedule a checkup if symptoms persist for more than 3 days',           'low');

-- ─── MICROSERVICES ───────────────────────────────────────────
INSERT INTO microservices (name, status, response_time) VALUES
  ('Auth Service', 'operational', '12ms'),
  ('AI Engine',    'operational', '45ms'),
  ('Data Sync',    'operational', '28ms');

-- ─── SYMPTOMS HISTORY ────────────────────────────────────────
INSERT INTO symptoms_history (date, symptoms, severity, severity_score, status, ai_note, duration) VALUES
  ('2026-04-12', '["Headache","Fatigue"]',  'Moderate', 6, 'Active',   'Possible tension headache',  '2 hrs'),
  ('2026-04-10', '["Fatigue"]',             'Mild',     3, 'Active',   'Rest recommended',           '18 hrs'),
  ('2026-04-07', '["Cough","Sore Throat"]', 'Mild',     4, 'Resolved', 'Viral throat infection',     '3 days'),
  ('2026-04-05', '["Fever","Body Ache"]',   'Severe',   8, 'Resolved', 'Flu-like symptoms monitored','2 days'),
  ('2026-04-03', '["Sore Throat"]',         'Mild',     3, 'Resolved', 'Mild pharyngitis',           '1 day'),
  ('2026-04-01', '["Nausea","Dizziness"]',  'Moderate', 5, 'Resolved', 'Possible dehydration',       '6 hrs'),
  ('2026-03-28', '["Headache"]',            'Mild',     3, 'Resolved', 'Tension headache resolved',  '4 hrs');

-- ─── HEALTH SCORE TREND ──────────────────────────────────────
INSERT INTO health_score_trend (date_label, score, symptoms_count) VALUES
  ('Mar 22', 62, 4), ('Mar 25', 58, 5), ('Mar 28', 65, 3),
  ('Apr 01', 70, 2), ('Apr 03', 68, 3), ('Apr 05', 74, 2),
  ('Apr 07', 72, 2), ('Apr 09', 78, 1), ('Apr 12', 85, 1);

-- ─── SYMPTOM FREQUENCY ───────────────────────────────────────
INSERT INTO symptom_frequency (symptom, count) VALUES
  ('Headache', 8), ('Fatigue', 6), ('Cough', 4), ('Nausea', 3), ('Dizziness', 2);

-- ─── AI ANALYSIS ─────────────────────────────────────────────
INSERT INTO ai_analysis (confidence) VALUES (87);

INSERT INTO ai_conditions (name, confidence, severity, color, description, urgency, causes, treatments) VALUES
  ('Tension Headache', 87, 'Low', 'blue',
   'A common headache type causing mild to moderate pain, often described as feeling like a tight band around the head.',
   'Low',
   '["Stress and anxiety","Poor posture","Eye strain from screens","Dehydration","Lack of sleep"]',
   '["Over-the-counter pain relievers (Ibuprofen/Acetaminophen)","Rest in a quiet, dark room","Apply cold or warm compress","Stay hydrated"]'),
  ('Viral Fatigue Syndrome', 74, 'Medium', 'yellow',
   'Post-viral fatigue characterized by persistent tiredness not relieved by rest.',
   'Medium',
   '["Recent viral infection","Immune system response","Sleep disruption","Nutritional deficiencies"]',
   '["Adequate rest (7-9 hours)","Gradual return to activity","Balanced nutrition","Hydration"]'),
  ('Stress-Related Disorder', 61, 'Medium', 'orange',
   'Physical manifestation of chronic stress causing headaches, fatigue, and body tension.',
   'Low',
   '["Work/life stress","Anxiety","Poor sleep quality","Lifestyle factors"]',
   '["Relaxation techniques (Yoga, Meditation)","Regular exercise","Counseling/Therapy","Stress management techniques"]');

INSERT INTO ai_recommendations (icon, title, detail, priority, time_label) VALUES
  ('💧', 'Hydration',         'Drink 8-10 glasses of water daily. Dehydration is a key trigger for headaches.',          'high',   'Immediate'),
  ('😴', 'Sleep Hygiene',     'Maintain consistent sleep schedule. Aim for 7-8 hours per night to reduce fatigue.',       'high',   'Tonight'),
  ('🧘', 'Stress Management', 'Practice 10 minutes of deep breathing or meditation to manage tension headaches.',          'medium', 'Daily'),
  ('🥗', 'Nutrition',         'Avoid skipping meals. Low blood sugar can trigger headaches and fatigue.',                  'medium', 'Ongoing'),
  ('🏃', 'Light Exercise',    'A 20-minute walk can boost mood and reduce headache frequency.',                            'low',    'This week'),
  ('📱', 'Screen Breaks',     'Follow the 20-20-20 rule: every 20 mins, look at something 20 feet away for 20 seconds.', 'low',    'Daily');

INSERT INTO ai_sparkline_data (day_label, score) VALUES
  ('D1',65),('D2',62),('D3',68),('D4',70),('D5',67),('D6',72),('D7',69),
  ('D8',74),('D9',71),('D10',76),('D11',78),('D12',75),('D13',80),('D14',82);

INSERT INTO ai_doctor_triggers (trigger_text, urgency) VALUES
  ('Fever exceeds 103°F (39.4°C)',                        'Immediate'),
  ('Symptoms persist more than 5 days without improvement','Within 24h'),
  ('Severe or sudden worsening headache',                 'Immediate'),
  ('Headache with stiff neck or light sensitivity',       'Emergency'),
  ('Difficulty breathing or chest pain',                  'Emergency');

-- ─── USER PROFILE ────────────────────────────────────────────
INSERT INTO user_profile (user_id, name, email, phone, dob, blood_type, height, weight, allergies, conditions, join_date) VALUES
  (1, 'John Doe', 'john.doe@example.com', '+1 (555) 123-4567', '1990-03-15', 'O+', '5''10"', '168 lbs', 'Penicillin, Pollen', 'Mild Hypertension', 'January 2026');

INSERT INTO user_wellness (user_id, metric, value, full_mark) VALUES
  (1, 'Sleep',     75, 100), (1, 'Nutrition', 60, 100),
  (1, 'Exercise',  55, 100), (1, 'Hydration', 80, 100),
  (1, 'Stress',    65, 100), (1, 'Mental',    70, 100);

INSERT INTO user_vitals (user_id, label, value, status) VALUES
  (1, 'Heart Rate',     '72 bpm',  'normal'),
  (1, 'Blood Pressure', '118/76',  'normal'),
  (1, 'Blood Type',     'O+',      'info'),
  (1, 'Weight',         '168 lbs', 'normal');

INSERT INTO emergency_contacts (user_id, name, relation, phone) VALUES
  (1, 'Jane Doe',   'Spouse',            '+1 (555) 234-5678'),
  (1, 'Dr. Smith',  'Primary Physician', '+1 (555) 345-6789');

INSERT INTO notification_preferences (user_id, pref_id, label, enabled) VALUES
  (1, 'symptom_reminders', 'Daily symptom reminders',   1),
  (1, 'ai_suggestions',    'AI health suggestions',     1),
  (1, 'critical_alerts',   'Critical health alerts',    1),
  (1, 'weekly_reports',    'Weekly health reports',     0);

-- ─── ADMIN USERS ─────────────────────────────────────────────
INSERT INTO admin_users (name, email, status, role, symptoms, risk_level, last_login, health_score, joined_date) VALUES
  ('John Doe',       'john.doe@example.com',  'Active',   'Patient', 12, 'Low',      '2 hours ago',  85, 'Jan 2026'),
  ('Jane Smith',     'jane.smith@example.com','Active',   'Patient',  8, 'Low',      '1 day ago',    78, 'Feb 2026'),
  ('Mike Johnson',   'mike.j@example.com',    'Inactive', 'Patient',  5, 'Medium',   '1 week ago',   62, 'Jan 2026'),
  ('Sarah Williams', 'sarah.w@example.com',   'Active',   'Patient', 15, 'High',     '30 min ago',   45, 'Mar 2026'),
  ('Tom Brown',      'tom.brown@example.com', 'Active',   'Patient',  6, 'Low',      '3 hours ago',  90, 'Feb 2026'),
  ('Emma Davis',     'emma.d@example.com',    'Inactive', 'Patient',  3, 'Low',      '2 weeks ago',  71, 'Mar 2026'),
  ('Robert Wilson',  'robert.w@example.com',  'Active',   'Patient', 22, 'Critical', '1 hour ago',   28, 'Dec 2025'),
  ('Emily Martinez', 'emily.m@example.com',   'Active',   'Patient', 18, 'Critical', '4 hours ago',  32, 'Jan 2026');

-- ─── ADMIN REPORTS ───────────────────────────────────────────
INSERT INTO weekly_symptoms (day_label, mild, moderate, severe) VALUES
  ('Mon',25,12,8),('Tue',30,15,7),('Wed',35,18,8),
  ('Thu',28,14,6),('Fri',32,16,7),('Sat',22,10,6),('Sun',18,8,6);

INSERT INTO ai_usage_data (week_label, queries, accuracy) VALUES
  ('Week 1',320,82),('Week 2',480,84),('Week 3',560,86),('Week 4',720,87);

INSERT INTO severity_data (name, value, color) VALUES
  ('Mild',450,'#3b82f6'),('Moderate',280,'#f59e0b'),('Severe',120,'#ef4444');

INSERT INTO user_retention (month_label, d1, d7, d30) VALUES
  ('Nov',85,62,45),('Dec',88,65,48),('Jan',90,68,52),
  ('Feb',87,70,55),('Mar',92,74,58),('Apr',94,78,62);

INSERT INTO report_kpis (label, value, change_pct, icon) VALUES
  ('Total Symptoms','850',   '+12%','Activity'),
  ('AI Queries',    '2,080', '+28%','Brain'),
  ('Active Users',  '892',   '+8%', 'Users'),
  ('Avg Response',  '18 min','-22%','Clock');

INSERT INTO report_insights (icon, title, detail, trend, color) VALUES
  ('🕐','Peak Usage Time',     'Most symptoms logged between 6 PM – 10 PM',     '+18% evenings',   'bg-blue-50 border-blue-200'),
  ('🤖','AI Accuracy Rate',    '87% user-validated accuracy on AI suggestions',  '+5% this month',  'bg-purple-50 border-purple-200'),
  ('💊','Avg Resolution Time', 'Symptoms resolve on avg in 3.2 days',            '-0.4 days better','bg-green-50 border-green-200'),
  ('📊','Daily Active Users',  '72% of registered users log symptoms weekly',    '+8% engagement',  'bg-orange-50 border-orange-200'),
  ('🏥','Critical Escalations','2.4% of cases escalated to emergency care',      '-0.3% reduction', 'bg-red-50 border-red-200'),
  ('🔔','Alert Response Rate', 'Admin responds to critical alerts avg in 18 min','-4 min faster',   'bg-indigo-50 border-indigo-200');

-- ─── SEVERE CASES ────────────────────────────────────────────
INSERT INTO severe_cases (name, email, phone, severity, risk_score, symptoms, duration, last_update, alerts_sent, status) VALUES
  ('Robert Wilson',  'robert.w@example.com','+1 234-567-8901','Critical',8.5,
   '["High Fever (102°F)","Chest Pain","Shortness of Breath","Fatigue"]','3 days','2 hours ago',2,'Uncontacted'),
  ('Emily Martinez', 'emily.m@example.com', '+1 234-567-8902','Critical',8.2,
   '["Severe Headache","Blurred Vision","Dizziness","Nausea"]',          '2 days','4 hours ago',1,'Contacted'),
  ('David Thompson', 'david.t@example.com', '+1 234-567-8903','High',    7.8,
   '["Persistent Cough","Chest Tightness","High Fever","Body Ache"]',   '4 days','6 hours ago',3,'Under Observation'),
  ('Maria Garcia',   'maria.g@example.com', '+1 234-567-8904','High',    7.5,
   '["Abdominal Pain","Vomiting","High Fever","Dehydration"]',           '1 day', '1 hour ago', 0,'Uncontacted'),
  ('James Anderson', 'james.a@example.com', '+1 234-567-8905','High',    7.3,
   '["Difficulty Breathing","Rapid Heart Rate","Anxiety","Sweating"]',  '5 days','3 hours ago',2,'Contacted');

-- ─── ALERTS ──────────────────────────────────────────────────
INSERT INTO alert_history (title, message, recipient, recipient_count, type, status, sent_at, read_at) VALUES
  ('Emergency Health Advisory',      'Please visit the emergency room immediately based on your symptoms.','Robert Wilson',    1,  'Critical',      'Sent',   '2 hours ago','1 hour ago'),
  ('Schedule Follow-up Appointment', 'Your symptoms require a follow-up consultation.',                   'All High Risk',    5,  'High Priority', 'Sent',   '5 hours ago','4 hours ago'),
  ('Medication Reminder',            'Don''t forget to take your prescribed medication as scheduled.',     'Emily Martinez',   1,  'Normal',        'Sent',   '1 day ago',  '1 day ago'),
  ('System Maintenance Notice',      'Platform maintenance on Sunday 2 AM - 4 AM.',                       'All Users',        892,'Broadcast',     'Pending','Not sent yet','-'),
  ('Health Checkup Recommendation',  'Based on your recent symptoms, we recommend a comprehensive checkup.','David Thompson', 1,  'Normal',        'Sent',   '2 days ago', '2 days ago');

INSERT INTO alert_stats (total_sent, delivered, pending, recipients) VALUES (1247, 1189, 58, 892);

INSERT INTO alert_users (name, severity) VALUES
  ('Robert Wilson',  'Critical'),
  ('Emily Martinez', 'Critical'),
  ('David Thompson', 'High'),
  ('Maria Garcia',   'High'),
  ('James Anderson', 'High');

-- ─── ADMIN DASHBOARD ─────────────────────────────────────────
INSERT INTO admin_dashboard_stats (label, value, change_val, trend) VALUES
  ('Total Users',     '892',   '+12%', 'up'),
  ('Active Today',    '348',   '+8%',  'up'),
  ('AI Queries',      '2,081', '+28%', 'up'),
  ('Critical Alerts', '7',     '-3',   'down');

INSERT INTO user_growth (month_label, total, active) VALUES
  ('Nov',620,410),('Dec',698,450),('Jan',745,490),
  ('Feb',800,530),('Mar',856,570),('Apr',892,610);

INSERT INTO ai_queries_by_hour (hour_label, queries) VALUES
  ('6am',12),('8am',45),('10am',78),('12pm',95),
  ('2pm',88),('4pm',102),('6pm',145),('8pm',168),('10pm',120);

INSERT INTO services_health (name, icon, response_time, uptime, requests_per_min, status) VALUES
  ('Auth Service',   'Shield',   '12ms','99.99%',245,'online'),
  ('AI Engine',      'Brain',    '45ms','99.95%', 89,'online'),
  ('Notify Service', 'Bell',     '28ms','99.97%',156,'online'),
  ('Data Sync',      'Database', '18ms','99.98%',312,'online'),
  ('API Gateway',    'Globe',    '8ms', '99.99%',892,'online');

INSERT INTO recent_activity (time_label, event, severity) VALUES
  ('2 min ago',  'Robert Wilson logged critical symptoms',          'critical'),
  ('8 min ago',  'AI Engine flagged high-risk pattern for user #7', 'high'),
  ('15 min ago', 'Emily Martinez contacted by admin',               'medium'),
  ('22 min ago', 'New user registration: Tom Brown',                'low'),
  ('1 hr ago',   'Weekly health report generated',                  'info');

INSERT INTO symptom_freq_admin (symptom, count, pct) VALUES
  ('Headache',  124,75),('Fatigue', 98,60),('Fever',76,46),
  ('Cough',      65,40),('Chest Pain',32,19);

-- ─── HOME PAGE ───────────────────────────────────────────────
INSERT INTO home_hero_stats (value, label, color) VALUES
  ('99.9%','Uptime SLA',   'text-indigo-600'),
  ('24/7', 'AI Monitoring','text-purple-600'),
  ('HIPAA','Compliant',    'text-pink-600');

INSERT INTO home_live_metrics (heart_rate, symptoms_logged, health_trend, ai_suggestions)
  VALUES (72, 3, 'Improving', 2);

INSERT INTO home_features (icon, title, description, color) VALUES
  ('Activity', 'Symptom Tracking','Log and track your health symptoms with ease',         'from-blue-500 to-cyan-500'),
  ('Brain',    'AI Suggestions',  'Get intelligent health insights powered by AI',         'from-purple-500 to-pink-500'),
  ('FileText', 'Health History',  'Access your complete medical history anytime',          'from-orange-500 to-red-500');

INSERT INTO home_services (name, status, uptime) VALUES
  ('Auth Service',   'Active','99.99%'),
  ('AI Service',     'Active','99.95%'),
  ('Data Service',   'Active','99.98%'),
  ('Notify Service', 'Active','99.97%');

-- ============================================================
--  healthcare_db — Tables Only (run inside healthcare_db)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('patient','admin') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  label    VARCHAR(100),
  value    VARCHAR(50),
  icon     VARCHAR(50),
  color    VARCHAR(60),
  bg_color VARCHAR(60),
  status   VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS health_trend (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  day_label VARCHAR(10),
  value     INT
);

CREATE TABLE IF NOT EXISTS recent_symptoms (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  symptom    VARCHAR(100),
  severity   VARCHAR(50),
  date_label VARCHAR(50),
  time_label VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  text     TEXT,
  priority VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS microservices (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100),
  status        VARCHAR(50),
  response_time VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS symptoms_history (
  id             INT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS health_score_trend (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  date_label     VARCHAR(20),
  score          INT,
  symptoms_count INT
);

CREATE TABLE IF NOT EXISTS symptom_frequency (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  symptom VARCHAR(100),
  count   INT
);

CREATE TABLE IF NOT EXISTS ai_analysis (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  confidence INT
);

CREATE TABLE IF NOT EXISTS ai_conditions (
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

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  icon       VARCHAR(10),
  title      VARCHAR(100),
  detail     TEXT,
  priority   VARCHAR(20),
  time_label VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ai_sparkline_data (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  day_label VARCHAR(10),
  score     INT
);

CREATE TABLE IF NOT EXISTS ai_doctor_triggers (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  trigger_text TEXT,
  urgency      VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_profile (
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

CREATE TABLE IF NOT EXISTS user_wellness (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  user_id   INT DEFAULT 1,
  metric    VARCHAR(50),
  value     INT,
  full_mark INT
);

CREATE TABLE IF NOT EXISTS user_vitals (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT 1,
  label   VARCHAR(100),
  value   VARCHAR(50),
  status  VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  user_id  INT DEFAULT 1,
  name     VARCHAR(100),
  relation VARCHAR(50),
  phone    VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT 1,
  pref_id VARCHAR(50),
  label   VARCHAR(200),
  enabled TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS admin_users (
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

CREATE TABLE IF NOT EXISTS weekly_symptoms (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  day_label VARCHAR(10),
  mild      INT,
  moderate  INT,
  severe    INT
);

CREATE TABLE IF NOT EXISTS ai_usage_data (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  week_label VARCHAR(20),
  queries    INT,
  accuracy   INT
);

CREATE TABLE IF NOT EXISTS severity_data (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  value INT,
  color VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS user_retention (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  month_label VARCHAR(10),
  d1  INT,
  d7  INT,
  d30 INT
);

CREATE TABLE IF NOT EXISTS report_kpis (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  label      VARCHAR(100),
  value      VARCHAR(50),
  change_pct VARCHAR(20),
  icon       VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS report_insights (
  id     INT PRIMARY KEY AUTO_INCREMENT,
  icon   VARCHAR(10),
  title  VARCHAR(100),
  detail TEXT,
  trend  VARCHAR(100),
  color  VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS severe_cases (
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

CREATE TABLE IF NOT EXISTS alert_history (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  title           VARCHAR(200),
  message         TEXT,
  recipient       VARCHAR(100),
  recipient_count INT,
  type            VARCHAR(50),
  status          VARCHAR(20),
  sent_at         VARCHAR(50),
  read_at         VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS alert_stats (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  total_sent INT,
  delivered  INT,
  pending    INT,
  recipients INT
);

CREATE TABLE IF NOT EXISTS alert_users (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  name     VARCHAR(100),
  severity VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS admin_dashboard_stats (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  label      VARCHAR(100),
  value      VARCHAR(50),
  change_val VARCHAR(20),
  trend      VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS user_growth (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  month_label VARCHAR(10),
  total       INT,
  active      INT
);

CREATE TABLE IF NOT EXISTS ai_queries_by_hour (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  hour_label VARCHAR(10),
  queries    INT
);

CREATE TABLE IF NOT EXISTS services_health (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  name             VARCHAR(100),
  icon             VARCHAR(50),
  response_time    VARCHAR(20),
  uptime           VARCHAR(20),
  requests_per_min INT,
  status           VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS recent_activity (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  time_label VARCHAR(50),
  event      TEXT,
  severity   VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS symptom_freq_admin (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  symptom VARCHAR(100),
  count   INT,
  pct     INT
);

CREATE TABLE IF NOT EXISTS home_hero_stats (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  value VARCHAR(50),
  label VARCHAR(100),
  color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS home_live_metrics (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  heart_rate      INT,
  symptoms_logged INT,
  health_trend    VARCHAR(50),
  ai_suggestions  INT
);

CREATE TABLE IF NOT EXISTS home_features (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  icon        VARCHAR(50),
  title       VARCHAR(100),
  description TEXT,
  color       VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS home_services (
  id     INT PRIMARY KEY AUTO_INCREMENT,
  name   VARCHAR(100),
  status VARCHAR(20),
  uptime VARCHAR(20)
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
const users = [
  { id: 1, name: "John Doe",       email: "john.doe@example.com",   password: "password123", role: "patient" },
  { id: 2, name: "Jane Smith",     email: "jane.smith@example.com", password: "password123", role: "patient" },
  { id: 3, name: "Admin User",     email: "admin@hospital.com",     password: "admin123",    role: "admin"   },
  { id: 4, name: "Dr. Admin",      email: "dr.admin@hospital.com",  password: "admin123",    role: "admin"   },
];

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const dashboardStats = [
  { label: "Heart Rate",       value: "72 bpm", icon: "Heart",       color: "bg-red-500",    bgColor: "bg-red-50",    status: "normal"     },
  { label: "Daily Steps",      value: "8,542",  icon: "Activity",    color: "bg-blue-500",   bgColor: "bg-blue-50",   status: "active"     },
  { label: "Health Score",     value: "85%",    icon: "TrendingUp",  color: "bg-green-500",  bgColor: "bg-green-50",  status: "good"       },
  { label: "Active Symptoms",  value: "2",      icon: "AlertCircle", color: "bg-orange-500", bgColor: "bg-orange-50", status: "monitoring" },
];

const healthTrend = [
  { date: "Mon", value: 72 },
  { date: "Tue", value: 68 },
  { date: "Wed", value: 75 },
  { date: "Thu", value: 70 },
  { date: "Fri", value: 73 },
  { date: "Sat", value: 71 },
  { date: "Sun", value: 74 },
];

const recentSymptoms = [
  { id: 1, symptom: "Headache", severity: "Moderate", date: "Today",     time: "2h ago"  },
  { id: 2, symptom: "Fatigue",  severity: "Mild",     date: "Yesterday", time: "18h ago" },
  { id: 3, symptom: "Cough",    severity: "Mild",     date: "2 days ago",time: "2d ago"  },
];

const aiSuggestions = [
  { id: 1, text: "Consider staying hydrated to help with headaches",                          priority: "high"   },
  { id: 2, text: "Your symptoms may indicate stress - try relaxation techniques",             priority: "medium" },
  { id: 3, text: "Schedule a checkup if symptoms persist for more than 3 days",              priority: "low"    },
];

const microservices = [
  { name: "Auth Service", status: "operational", responseTime: "12ms" },
  { name: "AI Engine",    status: "operational", responseTime: "45ms" },
  { name: "Data Sync",    status: "operational", responseTime: "28ms" },
];

// ─── SYMPTOMS HISTORY ────────────────────────────────────────────────────────
const symptomsHistory = [
  { id: 1, date: "2026-04-12", symptoms: ["Headache", "Fatigue"],    severity: "Moderate", severityScore: 6, status: "Active",   aiNote: "Possible tension headache",         duration: "2 hrs"  },
  { id: 2, date: "2026-04-10", symptoms: ["Fatigue"],                severity: "Mild",     severityScore: 3, status: "Active",   aiNote: "Rest recommended",                  duration: "18 hrs" },
  { id: 3, date: "2026-04-07", symptoms: ["Cough", "Sore Throat"],   severity: "Mild",     severityScore: 4, status: "Resolved", aiNote: "Viral throat infection",             duration: "3 days" },
  { id: 4, date: "2026-04-05", symptoms: ["Fever", "Body Ache"],     severity: "Severe",   severityScore: 8, status: "Resolved", aiNote: "Flu-like symptoms monitored",        duration: "2 days" },
  { id: 5, date: "2026-04-03", symptoms: ["Sore Throat"],            severity: "Mild",     severityScore: 3, status: "Resolved", aiNote: "Mild pharyngitis",                  duration: "1 day"  },
  { id: 6, date: "2026-04-01", symptoms: ["Nausea", "Dizziness"],    severity: "Moderate", severityScore: 5, status: "Resolved", aiNote: "Possible dehydration",              duration: "6 hrs"  },
  { id: 7, date: "2026-03-28", symptoms: ["Headache"],               severity: "Mild",     severityScore: 3, status: "Resolved", aiNote: "Tension headache resolved",         duration: "4 hrs"  },
];

const healthScoreTrend = [
  { date: "Mar 22", score: 62, symptoms: 4 }, { date: "Mar 25", score: 58, symptoms: 5 },
  { date: "Mar 28", score: 65, symptoms: 3 }, { date: "Apr 01", score: 70, symptoms: 2 },
  { date: "Apr 03", score: 68, symptoms: 3 }, { date: "Apr 05", score: 74, symptoms: 2 },
  { date: "Apr 07", score: 72, symptoms: 2 }, { date: "Apr 09", score: 78, symptoms: 1 },
  { date: "Apr 12", score: 85, symptoms: 1 },
];

const symptomFrequency = [
  { symptom: "Headache", count: 8 }, { symptom: "Fatigue",  count: 6 },
  { symptom: "Cough",    count: 4 }, { symptom: "Nausea",   count: 3 },
  { symptom: "Dizziness",count: 2 },
];

// ─── AI SUGGESTIONS ──────────────────────────────────────────────────────────
const aiAnalysis = {
  confidence: 87,
  conditions: [
    {
      id: 1, name: "Tension Headache", confidence: 87, severity: "Low", color: "blue",
      description: "A common headache type causing mild to moderate pain, often described as feeling like a tight band around the head.",
      causes:     ["Stress and anxiety", "Poor posture", "Eye strain from screens", "Dehydration", "Lack of sleep"],
      treatments: ["Over-the-counter pain relievers (Ibuprofen/Acetaminophen)", "Rest in a quiet, dark room", "Apply cold or warm compress", "Stay hydrated"],
      urgency: "Low",
    },
    {
      id: 2, name: "Viral Fatigue Syndrome", confidence: 74, severity: "Medium", color: "yellow",
      description: "Post-viral fatigue characterized by persistent tiredness not relieved by rest, often following a mild viral illness.",
      causes:     ["Recent viral infection", "Immune system response", "Sleep disruption", "Nutritional deficiencies"],
      treatments: ["Adequate rest (7-9 hours)", "Gradual return to activity", "Balanced nutrition", "Hydration"],
      urgency: "Medium",
    },
    {
      id: 3, name: "Stress-Related Disorder", confidence: 61, severity: "Medium", color: "orange",
      description: "Physical manifestation of chronic stress causing headaches, fatigue, and body tension.",
      causes:     ["Work/life stress", "Anxiety", "Poor sleep quality", "Lifestyle factors"],
      treatments: ["Relaxation techniques (Yoga, Meditation)", "Regular exercise", "Counseling/Therapy", "Stress management techniques"],
      urgency: "Low",
    },
  ],
  recommendations: [
    { icon: "💧", title: "Hydration",        detail: "Drink 8-10 glasses of water daily. Dehydration is a key trigger for headaches.",               priority: "high",   time: "Immediate"  },
    { icon: "😴", title: "Sleep Hygiene",    detail: "Maintain consistent sleep schedule. Aim for 7-8 hours per night to reduce fatigue.",            priority: "high",   time: "Tonight"    },
    { icon: "🧘", title: "Stress Management",detail: "Practice 10 minutes of deep breathing or meditation to manage tension headaches.",               priority: "medium", time: "Daily"      },
    { icon: "🥗", title: "Nutrition",        detail: "Avoid skipping meals. Low blood sugar can trigger headaches and fatigue.",                       priority: "medium", time: "Ongoing"    },
    { icon: "🏃", title: "Light Exercise",   detail: "A 20-minute walk can boost mood and reduce headache frequency.",                                 priority: "low",    time: "This week"  },
    { icon: "📱", title: "Screen Breaks",    detail: "Follow the 20-20-20 rule: every 20 mins, look at something 20 feet away for 20 seconds.",        priority: "low",    time: "Daily"      },
  ],
  sparklineData: [
    { day: "D1", score: 65 }, { day: "D2", score: 62 }, { day: "D3", score: 68 },
    { day: "D4", score: 70 }, { day: "D5", score: 67 }, { day: "D6", score: 72 },
    { day: "D7", score: 69 }, { day: "D8", score: 74 }, { day: "D9", score: 71 },
    { day: "D10",score: 76 }, { day: "D11",score: 78 }, { day: "D12",score: 75 },
    { day: "D13",score: 80 }, { day: "D14",score: 82 },
  ],
  doctorTriggers: [
    { trigger: "Fever exceeds 103°F (39.4°C)",                     urgency: "Immediate" },
    { trigger: "Symptoms persist more than 5 days without improvement", urgency: "Within 24h" },
    { trigger: "Severe or sudden worsening headache",              urgency: "Immediate" },
    { trigger: "Headache with stiff neck or light sensitivity",    urgency: "Emergency" },
    { trigger: "Difficulty breathing or chest pain",               urgency: "Emergency" },
  ],
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────
const userProfile = {
  name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567",
  dob: "1990-03-15", bloodType: "O+", height: "5'10\"", weight: "168 lbs",
  allergies: "Penicillin, Pollen", conditions: "Mild Hypertension",
  joinDate: "January 2026",
  wellness: [
    { metric: "Sleep",      value: 75, fullMark: 100 }, { metric: "Nutrition",  value: 60, fullMark: 100 },
    { metric: "Exercise",   value: 55, fullMark: 100 }, { metric: "Hydration",  value: 80, fullMark: 100 },
    { metric: "Stress",     value: 65, fullMark: 100 }, { metric: "Mental",     value: 70, fullMark: 100 },
  ],
  vitals: [
    { label: "Heart Rate",      value: "72 bpm",  status: "normal" },
    { label: "Blood Pressure",  value: "118/76",  status: "normal" },
    { label: "Blood Type",      value: "O+",      status: "info"   },
    { label: "Weight",          value: "168 lbs", status: "normal" },
  ],
  emergencyContacts: [
    { name: "Jane Doe",      relation: "Spouse",            phone: "+1 (555) 234-5678" },
    { name: "Dr. Smith",     relation: "Primary Physician", phone: "+1 (555) 345-6789" },
  ],
  notifications: [
    { id: "symptom_reminders",   label: "Daily symptom reminders",      enabled: true  },
    { id: "ai_suggestions",      label: "AI health suggestions",        enabled: true  },
    { id: "critical_alerts",     label: "Critical health alerts",       enabled: true  },
    { id: "weekly_reports",      label: "Weekly health reports",        enabled: false },
  ],
};

// ─── ADMIN USERS ─────────────────────────────────────────────────────────────
const adminUsers = [
  { id: 1, name: "John Doe",       email: "john.doe@example.com",  status: "Active",   role: "Patient", symptoms: 12, riskLevel: "Low",      lastLogin: "2 hours ago",  healthScore: 85, joinedDate: "Jan 2026" },
  { id: 2, name: "Jane Smith",     email: "jane.smith@example.com",status: "Active",   role: "Patient", symptoms: 8,  riskLevel: "Low",      lastLogin: "1 day ago",    healthScore: 78, joinedDate: "Feb 2026" },
  { id: 3, name: "Mike Johnson",   email: "mike.j@example.com",    status: "Inactive", role: "Patient", symptoms: 5,  riskLevel: "Medium",   lastLogin: "1 week ago",   healthScore: 62, joinedDate: "Jan 2026" },
  { id: 4, name: "Sarah Williams", email: "sarah.w@example.com",   status: "Active",   role: "Patient", symptoms: 15, riskLevel: "High",     lastLogin: "30 min ago",   healthScore: 45, joinedDate: "Mar 2026" },
  { id: 5, name: "Tom Brown",      email: "tom.brown@example.com", status: "Active",   role: "Patient", symptoms: 6,  riskLevel: "Low",      lastLogin: "3 hours ago",  healthScore: 90, joinedDate: "Feb 2026" },
  { id: 6, name: "Emma Davis",     email: "emma.d@example.com",    status: "Inactive", role: "Patient", symptoms: 3,  riskLevel: "Low",      lastLogin: "2 weeks ago",  healthScore: 71, joinedDate: "Mar 2026" },
  { id: 7, name: "Robert Wilson",  email: "robert.w@example.com",  status: "Active",   role: "Patient", symptoms: 22, riskLevel: "Critical", lastLogin: "1 hour ago",   healthScore: 28, joinedDate: "Dec 2025" },
  { id: 8, name: "Emily Martinez", email: "emily.m@example.com",   status: "Active",   role: "Patient", symptoms: 18, riskLevel: "Critical", lastLogin: "4 hours ago",  healthScore: 32, joinedDate: "Jan 2026" },
];

// ─── ADMIN REPORTS ───────────────────────────────────────────────────────────
const weeklySymptoms = [
  { day: "Mon", mild: 25, moderate: 12, severe: 8 }, { day: "Tue", mild: 30, moderate: 15, severe: 7 },
  { day: "Wed", mild: 35, moderate: 18, severe: 8 }, { day: "Thu", mild: 28, moderate: 14, severe: 6 },
  { day: "Fri", mild: 32, moderate: 16, severe: 7 }, { day: "Sat", mild: 22, moderate: 10, severe: 6 },
  { day: "Sun", mild: 18, moderate: 8,  severe: 6 },
];

const aiUsageData = [
  { week: "Week 1", queries: 320, accuracy: 82 }, { week: "Week 2", queries: 480, accuracy: 84 },
  { week: "Week 3", queries: 560, accuracy: 86 }, { week: "Week 4", queries: 720, accuracy: 87 },
];

const severityData = [
  { name: "Mild",     value: 450, color: "#3b82f6" },
  { name: "Moderate", value: 280, color: "#f59e0b" },
  { name: "Severe",   value: 120, color: "#ef4444" },
];

const userRetention = [
  { month: "Nov", d1: 85, d7: 62, d30: 45 }, { month: "Dec", d1: 88, d7: 65, d30: 48 },
  { month: "Jan", d1: 90, d7: 68, d30: 52 }, { month: "Feb", d1: 87, d7: 70, d30: 55 },
  { month: "Mar", d1: 92, d7: 74, d30: 58 }, { month: "Apr", d1: 94, d7: 78, d30: 62 },
];

const reportKPIs = [
  { label: "Total Symptoms", value: "850",   change: "+12%", icon: "Activity" },
  { label: "AI Queries",     value: "2,080", change: "+28%", icon: "Brain"    },
  { label: "Active Users",   value: "892",   change: "+8%",  icon: "Users"    },
  { label: "Avg Response",   value: "18 min",change: "-22%", icon: "Clock"    },
];

const reportInsights = [
  { icon: "🕐", title: "Peak Usage Time",       detail: "Most symptoms logged between 6 PM – 10 PM",       trend: "+18% evenings",     color: "bg-blue-50 border-blue-200"     },
  { icon: "🤖", title: "AI Accuracy Rate",      detail: "87% user-validated accuracy on AI suggestions",   trend: "+5% this month",    color: "bg-purple-50 border-purple-200"  },
  { icon: "💊", title: "Avg Resolution Time",   detail: "Symptoms resolve on avg in 3.2 days",             trend: "-0.4 days better",  color: "bg-green-50 border-green-200"   },
  { icon: "📊", title: "Daily Active Users",    detail: "72% of registered users log symptoms weekly",     trend: "+8% engagement",    color: "bg-orange-50 border-orange-200" },
  { icon: "🏥", title: "Critical Escalations",  detail: "2.4% of cases escalated to emergency care",       trend: "-0.3% reduction",   color: "bg-red-50 border-red-200"       },
  { icon: "🔔", title: "Alert Response Rate",   detail: "Admin responds to critical alerts avg in 18 min", trend: "-4 min faster",     color: "bg-indigo-50 border-indigo-200" },
];

// ─── ADMIN SEVERE CASES ──────────────────────────────────────────────────────
const severeCases = [
  { id: 1, name: "Robert Wilson",  email: "robert.w@example.com", phone: "+1 234-567-8901", severity: "Critical", riskScore: 8.5, symptoms: ["High Fever (102°F)", "Chest Pain", "Shortness of Breath", "Fatigue"],            duration: "3 days", lastUpdate: "2 hours ago", alertsSent: 2, status: "Uncontacted"       },
  { id: 2, name: "Emily Martinez", email: "emily.m@example.com",  phone: "+1 234-567-8902", severity: "Critical", riskScore: 8.2, symptoms: ["Severe Headache", "Blurred Vision", "Dizziness", "Nausea"],                     duration: "2 days", lastUpdate: "4 hours ago", alertsSent: 1, status: "Contacted"          },
  { id: 3, name: "David Thompson", email: "david.t@example.com",  phone: "+1 234-567-8903", severity: "High",     riskScore: 7.8, symptoms: ["Persistent Cough", "Chest Tightness", "High Fever", "Body Ache"],              duration: "4 days", lastUpdate: "6 hours ago", alertsSent: 3, status: "Under Observation" },
  { id: 4, name: "Maria Garcia",   email: "maria.g@example.com",  phone: "+1 234-567-8904", severity: "High",     riskScore: 7.5, symptoms: ["Abdominal Pain", "Vomiting", "High Fever", "Dehydration"],                     duration: "1 day",  lastUpdate: "1 hour ago",  alertsSent: 0, status: "Uncontacted"       },
  { id: 5, name: "James Anderson", email: "james.a@example.com",  phone: "+1 234-567-8905", severity: "High",     riskScore: 7.3, symptoms: ["Difficulty Breathing", "Rapid Heart Rate", "Anxiety", "Sweating"],             duration: "5 days", lastUpdate: "3 hours ago", alertsSent: 2, status: "Contacted"          },
];

// ─── ADMIN ALERTS ────────────────────────────────────────────────────────────
const alertHistory = [
  { id: 1, title: "Emergency Health Advisory",       message: "Please visit the emergency room immediately based on your symptoms.", recipient: "Robert Wilson",     recipientCount: 1,   type: "Critical",       status: "Sent",    sentAt: "2 hours ago", readAt: "1 hour ago"  },
  { id: 2, title: "Schedule Follow-up Appointment",  message: "Your symptoms require a follow-up consultation. Please schedule an appointment.", recipient: "All High Risk Users", recipientCount: 5, type: "High Priority", status: "Sent",    sentAt: "5 hours ago", readAt: "4 hours ago" },
  { id: 3, title: "Medication Reminder",             message: "Don't forget to take your prescribed medication as scheduled.",                     recipient: "Emily Martinez",    recipientCount: 1,   type: "Normal",         status: "Sent",    sentAt: "1 day ago",   readAt: "1 day ago"   },
  { id: 4, title: "System Maintenance Notice",       message: "Platform will undergo maintenance on Sunday 2 AM - 4 AM. Please plan accordingly.", recipient: "All Users",         recipientCount: 892, type: "Broadcast",      status: "Pending", sentAt: "Not sent yet",readAt: "-"           },
  { id: 5, title: "Health Checkup Recommendation",   message: "Based on your recent symptoms, we recommend a comprehensive health checkup.",       recipient: "David Thompson",    recipientCount: 1,   type: "Normal",         status: "Sent",    sentAt: "2 days ago",  readAt: "2 days ago"  },
];

const alertStats = { totalSent: 1247, delivered: 1189, pending: 58, recipients: 892 };

const alertUsers = [
  { id: 1, name: "Robert Wilson",  severity: "Critical" },
  { id: 2, name: "Emily Martinez", severity: "Critical" },
  { id: 3, name: "David Thompson", severity: "High"     },
  { id: 4, name: "Maria Garcia",   severity: "High"     },
  { id: 5, name: "James Anderson", severity: "High"     },
];

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const adminDashboardStats = [
  { label: "Total Users",     value: "892",    change: "+12%", trend: "up"   },
  { label: "Active Today",    value: "348",    change: "+8%",  trend: "up"   },
  { label: "AI Queries",      value: "2,081",  change: "+28%", trend: "up"   },
  { label: "Critical Alerts", value: "7",      change: "-3",   trend: "down" },
];

const userGrowth = [
  { month: "Nov", total: 620, active: 410 }, { month: "Dec", total: 698, active: 450 },
  { month: "Jan", total: 745, active: 490 }, { month: "Feb", total: 800, active: 530 },
  { month: "Mar", total: 856, active: 570 }, { month: "Apr", total: 892, active: 610 },
];

const aiQueriesByHour = [
  { hour: "6am", queries: 12 },  { hour: "8am",  queries: 45 }, { hour: "10am", queries: 78 },
  { hour: "12pm", queries: 95 }, { hour: "2pm",  queries: 88 }, { hour: "4pm",  queries: 102 },
  { hour: "6pm",  queries: 145 },{ hour: "8pm",  queries: 168 },{ hour: "10pm", queries: 120 },
];

const servicesHealth = [
  { name: "Auth Service",    icon: "Shield",       responseTime: "12ms",  uptime: "99.99%", requestsPerMin: 245,  status: "online" },
  { name: "AI Engine",       icon: "Brain",        responseTime: "45ms",  uptime: "99.95%", requestsPerMin: 89,   status: "online" },
  { name: "Notify Service",  icon: "Bell",         responseTime: "28ms",  uptime: "99.97%", requestsPerMin: 156,  status: "online" },
  { name: "Data Sync",       icon: "Database",     responseTime: "18ms",  uptime: "99.98%", requestsPerMin: 312,  status: "online" },
  { name: "API Gateway",     icon: "Globe",        responseTime: "8ms",   uptime: "99.99%", requestsPerMin: 892,  status: "online" },
];

const recentActivity = [
  { time: "2 min ago",  event: "Robert Wilson logged critical symptoms",        severity: "critical" },
  { time: "8 min ago",  event: "AI Engine flagged high-risk pattern for user #7", severity: "high"    },
  { time: "15 min ago", event: "Emily Martinez contacted by admin",             severity: "medium"  },
  { time: "22 min ago", event: "New user registration: Tom Brown",              severity: "low"     },
  { time: "1 hr ago",   event: "Weekly health report generated",               severity: "info"    },
];

const symptomFreqAdmin = [
  { symptom: "Headache",     count: 124, pct: 75 }, { symptom: "Fatigue",   count: 98,  pct: 60 },
  { symptom: "Fever",        count: 76,  pct: 46 }, { symptom: "Cough",     count: 65,  pct: 40 },
  { symptom: "Chest Pain",   count: 32,  pct: 19 },
];

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
const homeData = {
  heroStats: [
    { value: "99.9%", label: "Uptime SLA",    color: "text-indigo-600" },
    { value: "24/7",  label: "AI Monitoring", color: "text-purple-600" },
    { value: "HIPAA", label: "Compliant",      color: "text-pink-600"   },
  ],
  liveMetrics: {
    heartRate:       72,
    symptomsLogged:  3,
    healthTrend:     "Improving",
    aiSuggestions:   2,
  },
  features: [
    { icon: "Activity", title: "Symptom Tracking",  description: "Log and track your health symptoms with ease",           color: "from-blue-500 to-cyan-500"     },
    { icon: "Brain",    title: "AI Suggestions",    description: "Get intelligent health insights powered by AI",           color: "from-purple-500 to-pink-500"   },
    { icon: "FileText", title: "Health History",    description: "Access your complete medical history anytime",            color: "from-orange-500 to-red-500"    },
  ],
  services: [
    { name: "Auth Service",   status: "Active", uptime: "99.99%" },
    { name: "AI Service",     status: "Active", uptime: "99.95%" },
    { name: "Data Service",   status: "Active", uptime: "99.98%" },
    { name: "Notify Service", status: "Active", uptime: "99.97%" },
  ],
};

module.exports = {
  homeData,
  users, dashboardStats, healthTrend, recentSymptoms, aiSuggestions, microservices,
  symptomsHistory, healthScoreTrend, symptomFrequency,
  aiAnalysis,
  userProfile,
  adminUsers,
  weeklySymptoms, aiUsageData, severityData, userRetention, reportKPIs, reportInsights,
  severeCases,
  alertHistory, alertStats, alertUsers,
  adminDashboardStats, userGrowth, aiQueriesByHour, servicesHealth, recentActivity, symptomFreqAdmin,
};

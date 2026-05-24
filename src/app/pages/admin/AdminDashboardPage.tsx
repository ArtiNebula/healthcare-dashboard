import { useState, useEffect } from "react";
import {
  Users, Activity, TrendingUp, AlertCircle,
  Zap, Shield, Server, Clock, ArrowUpRight,
  Brain, Bell, Database, Globe,
} from "lucide-react";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { adminApi } from "../../services/api";

// ── icon + style maps (UI concerns stay in React) ────────────────────────────
const iconMap: Record<string, any> = {
  Users, Activity, TrendingUp, AlertCircle,
  Shield, Brain, Bell, Database, Globe, Server,
};

const statStyles = [
  { gradient: "from-blue-500 to-cyan-500",    bg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { gradient: "from-green-500 to-emerald-500", bg: "bg-green-50",  iconColor: "text-green-600"  },
  { gradient: "from-purple-500 to-indigo-500", bg: "bg-purple-50", iconColor: "text-purple-600" },
  { gradient: "from-red-500 to-rose-500",      bg: "bg-red-50",    iconColor: "text-red-600"    },
];

const serviceStyles: Record<string, { color: string; bg: string }> = {
  Shield:   { color: "text-green-600",  bg: "bg-green-50"  },
  Brain:    { color: "text-purple-600", bg: "bg-purple-50" },
  Bell:     { color: "text-orange-600", bg: "bg-orange-50" },
  Database: { color: "text-blue-600",   bg: "bg-blue-50"   },
  Globe:    { color: "text-indigo-600", bg: "bg-indigo-50" },
  Server:   { color: "text-indigo-600", bg: "bg-indigo-50" },
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [aiUsageData, setAiUsageData] = useState<any[]>([]);
  const [microservices, setMicroservices] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [symptomData, setSymptomData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => {
        setStats(res.data.stats);
        setUserGrowthData(res.data.userGrowth);
        setAiUsageData(res.data.aiQueriesByHour);
        setMicroservices(res.data.servicesHealth);
        setRecentActivity(res.data.recentActivity);
        setSymptomData(res.data.symptomFrequency);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Platform-wide analytics and microservices health monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600">Live data</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((stat: any, i: number) => {
          const style = statStyles[i] || statStyles[0];
          const Icon = iconMap[["Users", "Activity", "TrendingUp", "AlertCircle"][i]] || Activity;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${style.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${stat.trend === "down" ? "rotate-90" : ""}`} />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">User Growth</h3>
              <p className="text-xs text-gray-500 mt-0.5">Total vs Active users (6 months)</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              +58% this quarter
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Area type="monotone" dataKey="total"  stroke="#6366f1" strokeWidth={2} fill="url(#totalGrad)"  name="Total Users"  />
              <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} fill="url(#activeGrad)" name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Queries by Hour */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Queries Today</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Inference engine load by hour</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="queries" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="AI Queries" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Microservices Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Microservices Health</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>

          <div className="space-y-3">
            {microservices.map((svc: any, i: number) => {
              const Icon = iconMap[svc.icon] || Server;
              const style = serviceStyles[svc.icon] || { color: "text-gray-600", bg: "bg-gray-50" };
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50/30 transition-colors">
                  <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{svc.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600 font-medium capitalize">{svc.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{svc.requestsPerMin} req/min</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {svc.responseTime}
                    </div>
                    <div className="text-xs text-green-600 font-semibold mt-0.5">{svc.uptime}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Footer */}
          <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-900">HIPAA Compliant Infrastructure</p>
              <p className="text-xs text-indigo-600">TLS 1.3 encryption · RBAC enabled · Data encrypted at rest</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((act: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    act.severity === "critical" ? "bg-red-500" :
                    act.severity === "high"     ? "bg-orange-500" :
                    act.severity === "medium"   ? "bg-yellow-500" : "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{act.event}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Symptoms */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Top Symptoms This Month</h3>
            <div className="space-y-3">
              {symptomData.map((s: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{s.symptom}</span>
                    <span>{s.count} cases</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

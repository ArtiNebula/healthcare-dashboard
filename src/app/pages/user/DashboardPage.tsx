import { useState, useEffect } from "react";
import { Activity, Heart, TrendingUp, AlertCircle, Brain, Zap, Shield } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardApi, profileApi } from "../../services/api";

const iconMap: Record<string, any> = { Heart, Activity, TrendingUp, AlertCircle };

export function DashboardPage() {
  const [healthData, setHealthData] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [microservices, setMicroservices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [userName, setUserName] = useState<string>(stored.name || "");

  useEffect(() => {
    if (!stored.name) {
      profileApi.get().then((res) => {
        if (res.data?.name) setUserName(res.data.name);
      }).catch(() => {});
    }
    dashboardApi.getAll().then((res) => {
      setStats(res.data.stats);
      setHealthData(res.data.healthTrend);
      setRecentSymptoms(res.data.recentSymptoms);
      setAiSuggestions(res.data.aiSuggestions);
      setMicroservices(res.data.microservices);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl mb-2 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, <span className="font-semibold text-indigo-600">{userName || "User"}</span>! Here's your real-time health overview</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Sync</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-sm text-gray-600">Last updated: Just now</span>
          </div>
        </div>
      </div>

      {/* Stats Cards with Real-time Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || Activity;
          return (
            <div
              key={index}
              className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Animated background */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 capitalize">{stat.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Health Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Health Trend</h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days monitoring</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Improving</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ fill: "#6366f1", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Microservices Status */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6" />
            <h2 className="text-xl font-semibold">System Status</h2>
          </div>
          <div className="space-y-4">
            {microservices.map((service, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{service.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs opacity-90">{service.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm opacity-75">
                  <span>Response Time</span>
                  <span className="font-semibold">{service.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <div>
                <div className="text-sm opacity-90">Security</div>
                <div className="font-semibold">HIPAA Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Symptoms & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Symptoms */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Symptoms</h2>
            <span className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="space-y-3">
            {recentSymptoms.map((item, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.severity === "Moderate" ? "bg-orange-100" : "bg-blue-100"
                  }`}>
                    <AlertCircle className={`w-6 h-6 ${
                      item.severity === "Moderate" ? "text-orange-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.symptom}</p>
                    <p className="text-sm text-gray-600">{item.date} • {item.time}</p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    item.severity === "Moderate"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">AI Health Insights</h2>
              <p className="text-sm opacity-90">Powered by advanced AI</p>
            </div>
          </div>
          <div className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed">{suggestion.text}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.priority === "high"
                        ? "bg-red-400/30"
                        : suggestion.priority === "medium"
                        ? "bg-yellow-400/30"
                        : "bg-green-400/30"
                    }`}>
                      {suggestion.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            View All AI Suggestions
          </button>
        </div>
      </div>
    </div>
  );
}

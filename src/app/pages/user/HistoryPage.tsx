import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Activity, ChevronRight, Download } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { symptomsApi } from "../../services/api";

const severityColors: Record<string, { bg: string; text: string }> = {
  Severe:   { bg: "bg-red-100",    text: "text-red-700"    },
  Moderate: { bg: "bg-orange-100", text: "text-orange-700" },
  Mild:     { bg: "bg-blue-100",   text: "text-blue-700"   },
};

export function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [healthScoreData, setHealthScoreData] = useState<any[]>([]);
  const [symptomFrequency, setSymptomFrequency] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [activeView, setActiveView] = useState<"table" | "timeline">("table");

  useEffect(() => {
    symptomsApi.getHistory().then((r) => setHistory(r.data)).catch(console.error);
    symptomsApi.getHealthTrend().then((r) => setHealthScoreData(r.data)).catch(console.error);
    symptomsApi.getFrequency().then((r) => setSymptomFrequency(r.data)).catch(console.error);
  }, []);

  const filtered = history.filter((item) => {
    const matchSearch = (item.symptoms || []).some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus   = filterStatus   === "all" || item.status   === filterStatus;
    const matchSeverity = filterSeverity === "all" || item.severity === filterSeverity;
    return matchSearch && matchStatus && matchSeverity;
  });

  const resolvedCount = history.filter((h) => h.status === "Resolved").length;
  const activeCount   = history.filter((h) => h.status === "Active").length;
  const avgSeverity   = history.length
    ? (history.reduce((a, b) => a + b.severityScore, 0) / history.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600 font-medium">Health History</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health History</h1>
            <p className="text-gray-500">Complete timeline of your logged symptoms and AI analysis</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm font-medium text-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Logged", value: history.length, icon: Activity, color: "bg-indigo-500", trend: "+3 this week" },
          { label: "Resolved", value: resolvedCount, icon: TrendingDown, color: "bg-green-500", trend: history.length ? `${Math.round((resolvedCount / history.length) * 100)}% resolved` : "0% resolved" },
          { label: "Active", value: activeCount, icon: TrendingUp, color: "bg-orange-500", trend: "Under monitoring" },
          { label: "Avg Severity", value: `${avgSeverity}/10`, icon: Activity, color: "bg-purple-500", trend: "Improving" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Health Score Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Health Score Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Last 21 days</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-semibold">+23 pts</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={healthScoreData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis domain={[40, 100]} stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} name="Health Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Symptom Frequency */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Top Symptoms</h3>
          <p className="text-xs text-gray-500 mb-4">Frequency last 30 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={symptomFrequency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="symptom" tick={{ fontSize: 10 }} stroke="#9ca3af" width={60} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Occurrences" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table / Timeline Toggle */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("table")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === "table" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveView("timeline")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === "timeline" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Timeline View
            </button>
          </div>

          <div className="flex gap-3 flex-wrap w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="all">All Severity</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {activeView === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Symptoms</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Severity</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">AI Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => {
                  const sc = severityColors[item.severity];
                  return (
                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{item.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {item.symptoms.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{item.duration}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          {item.severity} ({item.severityScore}/10)
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.status === "Active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                          <span className={`text-sm font-medium ${item.status === "Active" ? "text-green-700" : "text-gray-500"}`}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-gray-500 italic">{item.aiNote}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Timeline View */}
        {activeView === "timeline" && (
          <div className="p-6 space-y-4">
            {filtered.map((item, i) => {
              const sc = severityColors[item.severity];
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${sc.bg}`}>
                      <Activity className={`w-5 h-5 ${sc.text}`} />
                    </div>
                    {i < filtered.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{item.date}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>{item.severity}</span>
                        </div>
                        <span className={`text-xs ${item.status === "Active" ? "text-green-600 font-semibold" : "text-gray-400"}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.symptoms.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 italic">AI: {item.aiNote} · Duration: {item.duration}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No symptoms found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

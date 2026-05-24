import { useState, useEffect } from "react";
import { Download, TrendingUp, Brain, Users, Activity, ArrowUpRight, Clock } from "lucide-react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { adminApi } from "../../services/api";

const iconMap: Record<string, any> = { Activity, Brain, Users, Clock };

export function ReportsPage() {
  const [weeklySymptoms, setWeeklySymptoms] = useState<any[]>([]);
  const [aiUsageData, setAiUsageData] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [userRetention, setUserRetention] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getReports().then((res) => {
      setWeeklySymptoms(res.data.weeklySymptoms);
      setAiUsageData(res.data.aiUsageData);
      setSeverityData(res.data.severityData);
      setUserRetention(res.data.userRetention);
      setKpis(res.data.kpis);
      setInsights(res.data.insights);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading reports...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive platform insights and health trend analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm font-medium text-sm">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-medium text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi: any, i: number) => {
          const Icon = iconMap[kpi.icon] || Activity;
          const colorMap: Record<string, { color: string; bg: string }> = {
            Activity: { color: "text-blue-600",   bg: "bg-blue-50"   },
            Brain:    { color: "text-purple-600",  bg: "bg-purple-50" },
            Users:    { color: "text-green-600",   bg: "bg-green-50"  },
            Clock:    { color: "text-orange-600",  bg: "bg-orange-50" },
          };
          const { color, bg } = colorMap[kpi.icon] || { color: "text-gray-600", bg: "bg-gray-50" };
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Symptom Severity Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Weekly Symptom Breakdown</h3>
              <p className="text-xs text-gray-500 mt-0.5">By severity level</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklySymptoms}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="mild" stackId="a" fill="#3b82f6" name="Mild" radius={[0, 0, 0, 0]} />
              <Bar dataKey="moderate" stackId="a" fill="#f59e0b" name="Moderate" />
              <Bar dataKey="severe" stackId="a" fill="#ef4444" name="Severe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Severity Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">All-time breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {severityData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-700">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* AI Usage & Accuracy */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Engine Performance</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Queries processed & accuracy trend</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[75, 95]} stroke="#9ca3af" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar yAxisId="left" dataKey="queries" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="AI Queries" />
              <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 5 }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Retention */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">User Retention Rates</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Day 1, 7 & 30 retention (%)</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={userRetention}>
              <defs>
                <linearGradient id="d1Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="d7Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="d30Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis domain={[30, 100]} stroke="#9ca3af" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Area type="monotone" dataKey="d1" stroke="#6366f1" strokeWidth={2} fill="url(#d1Grad)" name="Day 1" />
              <Area type="monotone" dataKey="d7" stroke="#10b981" strokeWidth={2} fill="url(#d7Grad)" name="Day 7" />
              <Area type="monotone" dataKey="d30" stroke="#f59e0b" strokeWidth={2} fill="url(#d30Grad)" name="Day 30" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Key Platform Insights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <div key={i} className={`p-4 rounded-xl border ${ins.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{ins.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{ins.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{ins.detail}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-700">
                    <ArrowUpRight className="w-3 h-3" />
                    {ins.trend}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

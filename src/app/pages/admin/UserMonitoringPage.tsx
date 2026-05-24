import { useState, useEffect } from "react";
import { Search, Eye, Filter, Users, Activity, TrendingUp, UserCheck, MoreVertical, Download } from "lucide-react";
import { adminApi } from "../../services/api";

const riskConfig = {
  Critical: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  High: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  Medium: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  Low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
};

export function UserMonitoringPage() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    adminApi.getUsers({ risk: filterRisk, status: filterStatus, search: searchTerm })
      .then((res) => { setAllUsers(res.data); setTotalUsers(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [searchTerm, filterRisk, filterStatus]);

  const filtered = allUsers;
  const activeCount = allUsers.filter((u) => u.status === "Active").length;
  const criticalCount = allUsers.filter((u) => u.riskLevel === "Critical").length;
  const highRiskCount = allUsers.filter((u) => u.riskLevel === "High" || u.riskLevel === "Critical").length;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Monitoring</h1>
          <p className="text-gray-500">Real-time tracking of patient activity and health metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm font-medium text-sm">
          <Download className="w-4 h-4" />
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-500", sub: "Registered patients" },
          { label: "Active Now", value: activeCount, icon: UserCheck, color: "bg-green-500", sub: "Currently online" },
          { label: "High Risk", value: highRiskCount, icon: TrendingUp, color: "bg-orange-500", sub: "Need monitoring" },
          { label: "Critical Cases", value: criticalCount, icon: Activity, color: "bg-red-500", sub: "Immediate action" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">{filtered.length}</span> users shown
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="all">All Risk</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Level</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Health Score</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Symptoms</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => {
                const rc = riskConfig[user.riskLevel as keyof typeof riskConfig];
                const scoreColor = user.healthScore >= 70 ? "text-green-600" : user.healthScore >= 50 ? "text-yellow-600" : "text-red-600";
                const scoreBg = user.healthScore >= 70 ? "bg-green-50" : user.healthScore >= 50 ? "bg-yellow-50" : "bg-red-50";
                return (
                  <tr key={user.id} className={`hover:bg-indigo-50/20 transition-colors ${user.riskLevel === "Critical" ? "bg-red-50/30" : ""}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                        <span className={`text-sm font-medium ${user.status === "Active" ? "text-green-700" : "text-gray-500"}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${rc.bg} ${rc.text} w-fit`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                        {user.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${scoreBg}`}>
                        <span className={`text-sm font-bold ${scoreColor}`}>{user.healthScore}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${user.healthScore >= 70 ? "bg-green-500" : user.healthScore >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${user.healthScore}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-indigo-600">{user.symptoms}</span>
                      <span className="text-xs text-gray-400 ml-1">logged</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{user.lastLogin}</span>
                      <p className="text-xs text-gray-400">Joined {user.joinedDate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" title="More Options">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No users found matching your filters</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {filtered.length} of {totalUsers} users</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Real-time sync active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

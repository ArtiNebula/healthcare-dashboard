import { useState, useEffect } from "react";
import { Bell, Send, CheckCircle, Clock, Users, Filter } from "lucide-react";
import { adminApi } from "../../services/api";

export function AlertsPage() {
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [alertStats, setAlertStats] = useState({ totalSent: 0, delivered: 0, pending: 0, recipients: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [showSendAlertModal, setShowSendAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<"individual" | "group" | "broadcast">("individual");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "sent" | "pending">("all");
  const [sending, setSending] = useState(false);

  const fetchAlerts = () => {
    adminApi.getAlerts(filterStatus).then((res) => {
      setAlertHistory(res.data);
      setAlertStats(res.stats);
      setUsers(res.users);
    }).catch(console.error);
  };

  useEffect(() => { fetchAlerts(); }, [filterStatus]);

  const handleSendAlert = async () => {
    if (!alertTitle.trim() || !alertMessage.trim()) return;
    setSending(true);
    try {
      await adminApi.sendAlert({ title: alertTitle, message: alertMessage, alertType, selectedUsers });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      setShowSendAlertModal(false);
      setAlertMessage("");
      setAlertTitle("");
      setSelectedUsers([]);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "High Priority":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Broadcast":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Sent") {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <Clock className="w-4 h-4 text-yellow-600" />;
  };

  const filteredAlerts = alertHistory.filter((alert) => {
    if (filterStatus === "all") return true;
    return alert.status.toLowerCase() === filterStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl">Alert Management</h1>
            </div>
            <p className="text-gray-600">Send and manage patient notifications</p>
          </div>
          <button
            onClick={() => setShowSendAlertModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold"
          >
            <Send className="w-5 h-5" />
            Send New Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Bell className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Total Alerts Sent</p>
          <p className="text-3xl">{alertStats.totalSent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Delivered</p>
          <p className="text-3xl">{alertStats.delivered.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Clock className="w-8 h-8 text-yellow-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <p className="text-3xl">{alertStats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="w-8 h-8 text-purple-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Recipients</p>
          <p className="text-3xl">{alertStats.recipients.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl">Alert History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Recipient</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Sent At</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Read At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{alert.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{alert.message.substring(0, 60)}...</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{alert.recipient}</div>
                    <div className="text-sm text-gray-500">{alert.recipientCount} {alert.recipientCount === 1 ? 'user' : 'users'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getTypeColor(alert.type)}`}>
                      {alert.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(alert.status)}
                      <span className={alert.status === "Sent" ? "text-green-700" : "text-yellow-700"}>
                        {alert.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{alert.sentAt}</td>
                  <td className="py-4 px-6 text-gray-700">{alert.readAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSendAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl">Send New Alert</h2>
                <p className="text-sm text-gray-600">Create and send notification to patients</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700 font-semibold">Alert Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAlertType("individual")}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      alertType === "individual"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                    <div className="text-sm font-semibold">Individual</div>
                  </button>
                  <button
                    onClick={() => setAlertType("group")}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      alertType === "group"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-semibold">Group</div>
                  </button>
                  <button
                    onClick={() => setAlertType("broadcast")}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      alertType === "broadcast"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Bell className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold">Broadcast</div>
                  </button>
                </div>
              </div>

              {alertType !== "broadcast" && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-semibold">Select Recipients</label>
                  <div className="border-2 border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                    {users.map((user) => (
                      <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{user.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.severity === "Critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {user.severity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-semibold">Alert Title</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter alert title..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-semibold">Alert Message</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  rows={5}
                  placeholder="Enter your message..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Note:</strong> Alerts will be sent via Email, SMS, and Push Notification.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSendAlertModal(false);
                  setAlertMessage("");
                  setAlertTitle("");
                  setSelectedUsers([]);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAlert}
                disabled={!alertMessage.trim() || !alertTitle.trim() || sending}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

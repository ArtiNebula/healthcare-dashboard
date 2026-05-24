import { useState, useEffect } from "react";
import { AlertTriangle, Send, Eye, Phone, Mail, Clock, TrendingUp } from "lucide-react";
import { adminApi } from "../../services/api";

export function SevereCasesPage() {
  const [severeCases, setSevereCases] = useState<any[]>([]);
  const [caseStats, setCaseStats] = useState({ critical: 0, high: 0, contacted: 0, avgResponseTime: "3.2h" });
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);

  useEffect(() => {
    adminApi.getSevereCases().then((res) => {
      setSevereCases(res.data);
      setCaseStats(res.stats);
    }).catch(console.error);
  }, []);

  const handleSendAlert = (userId: number) => {
    setSelectedUser(userId);
    setShowAlertModal(true);
  };

  const sendAlert = async () => {
    if (!selectedUser || !alertMessage.trim()) return;
    setSendingAlert(true);
    try {
      const res = await adminApi.sendSevereAlert(selectedUser, alertMessage);
      setSevereCases((prev) => prev.map((c) => c.id === selectedUser ? res.data : c));
    } catch (err) {
      console.error(err);
    } finally {
      setSendingAlert(false);
      setShowAlertModal(false);
      setAlertMessage("");
      setSelectedUser(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-green-100 text-green-700";
      case "Under Observation":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl">Severe Cases Monitoring</h1>
        </div>
        <p className="text-gray-600">Monitor and manage critical patient cases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-gray-600 text-sm mb-1">Critical Cases</p>
          <p className="text-3xl mb-1">{caseStats.critical}</p>
          <p className="text-sm text-red-600">Requires immediate attention</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm mb-1">High Risk</p>
          <p className="text-3xl mb-1">{caseStats.high}</p>
          <p className="text-sm text-orange-600">Monitor closely</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm mb-1">Contacted</p>
          <p className="text-3xl mb-1">{caseStats.contacted}</p>
          <p className="text-sm text-green-600">Follow-up in progress</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-500">
          <p className="text-gray-600 text-sm mb-1">Avg Response Time</p>
          <p className="text-3xl mb-1">{caseStats.avgResponseTime}</p>
          <p className="text-sm text-gray-600">Last 24 hours</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl">Active Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Patient</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Severity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Risk Score</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Key Symptoms</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {severeCases.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(patient.severity)}`}>
                      {patient.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${patient.riskScore >= 8 ? 'text-red-600' : 'text-orange-600'}`} />
                      <span className="font-semibold">{patient.riskScore}/10</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const symptomsArr = Array.isArray(patient.symptoms)
                        ? patient.symptoms
                        : String(patient.symptoms || "").split(", ").filter(Boolean);
                      return (
                        <div className="space-y-1">
                          {symptomsArr.slice(0, 2).map((symptom: string, index: number) => (
                            <div key={index} className="text-sm text-gray-700">• {symptom}</div>
                          ))}
                          {symptomsArr.length > 2 && (
                            <div className="text-sm text-indigo-600">+{symptomsArr.length - 2} more</div>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      {patient.duration}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{patient.lastUpdate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{patient.alertsSent} alerts sent</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendAlert(patient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl">Send Alert</h2>
                <p className="text-sm text-gray-600">
                  Send emergency notification to patient
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-700 font-semibold">
                Alert Message
              </label>
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                rows={5}
                placeholder="Enter urgent message for the patient..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Warning:</strong> This alert will be sent via Email, SMS, and Push Notification immediately.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAlertModal(false);
                  setAlertMessage("");
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={sendAlert}
                disabled={!alertMessage.trim() || sendingAlert}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingAlert ? "Sending..." : "Send Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Calendar, Edit2, Shield, Activity,
  Heart, Droplets, TrendingUp, Bell, CheckCircle2, AlertCircle, Lock, Loader2
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { profileApi } from "../../services/api";

const medicalHistory = [
  { condition: "Seasonal Allergies", year: "2020", status: "Managed", color: "bg-yellow-100 text-yellow-700" },
  { condition: "Migraine", year: "2018", status: "Monitored", color: "bg-orange-100 text-orange-700" },
  { condition: "Asthma (Mild)", year: "2015", status: "Controlled", color: "bg-green-100 text-green-700" },
];

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", dob: "",
    bloodType: "", height: "", weight: "", allergies: "", conditions: "", joinDate: "",
  });
  const [wellness, setWellness] = useState<{ metric: string; value: number; fullMark: number }[]>([]);
  const [vitals, setVitals] = useState<{ label: string; value: string; status: string }[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; relation: string; phone: string }[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; label: string; enabled: boolean }[]>([]);

  useEffect(() => {
    profileApi.get().then((res) => {
      const d = res.data;
      setProfile({
        name: d.name || "",
        email: d.email || "",
        phone: d.phone || "",
        dob: d.dob || "",
        bloodType: d.bloodType || "",
        height: d.height || "",
        weight: d.weight || "",
        allergies: d.allergies || "",
        conditions: d.conditions || "",
        joinDate: d.joinDate || "",
      });
      if (d.wellness?.length) setWellness(d.wellness);
      if (d.vitals?.length) setVitals(d.vitals);
      if (d.emergencyContacts?.length) setEmergencyContacts(d.emergencyContacts);
      if (d.notifications?.length) setNotifications(d.notifications);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await profileApi.update(profile);
      setSaveMsg("Profile saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setSaveMsg(err.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const toggleNotif = async (notif: { id: string; label: string; enabled: boolean }) => {
    const updated = !notif.enabled;
    setNotifications((prev) =>
      prev.map((n) => n.id === notif.id ? { ...n, enabled: updated } : n)
    );
    try {
      await profileApi.updateNotification(notif.id, updated);
    } catch {
      // revert on error
      setNotifications((prev) =>
        prev.map((n) => n.id === notif.id ? { ...n, enabled: notif.enabled } : n)
      );
    }
  };

  const radarData = wellness.length
    ? wellness.map((w) => ({ subject: w.metric, score: w.value }))
    : [
        { subject: "Sleep", score: 70 }, { subject: "Nutrition", score: 65 },
        { subject: "Exercise", score: 50 }, { subject: "Hydration", score: 80 },
        { subject: "Stress", score: 60 }, { subject: "Mental", score: 75 },
      ];

  const displayVitals = vitals.length
    ? vitals
    : [
        { label: "Heart Rate", value: "—", status: "normal" },
        { label: "Blood Pressure", value: "—", status: "normal" },
        { label: "Blood Type", value: profile.bloodType || "—", status: "normal" },
        { label: "Weight", value: profile.weight || "—", status: "normal" },
      ];

  const vitalIcons: Record<string, any> = {
    "Heart Rate": { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    "Blood Pressure": { icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
    "Blood Type": { icon: Droplets, color: "text-purple-500", bg: "bg-purple-50" },
    "Weight": { icon: Activity, color: "text-green-500", bg: "bg-green-50" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
          <p className="text-gray-500">Manage your personal and medical information</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span className={`text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${
              isEditing
                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {initials}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{profile.name || "—"}</h3>
            <p className="text-sm text-gray-500 mb-1">{profile.email || "—"}</p>
            {profile.joinDate && (
              <p className="text-xs text-gray-400">Member since {profile.joinDate}</p>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-green-700 text-xs font-medium border border-green-100 mt-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Active Member
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">24</p>
                <p className="text-xs text-gray-500">Symptoms</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-xs text-gray-500">AI Insights</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">85%</p>
                <p className="text-xs text-gray-500">Health</p>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-semibold">Overall Health Score</h3>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-5xl font-bold">85%</div>
              <div className="text-sm opacity-80 text-right">
                <div className="text-green-300 font-semibold">+7% this month</div>
                <div>Goal: 90%</div>
              </div>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: "85%" }} />
            </div>
            <p className="text-xs opacity-75 mt-3">Keep tracking symptoms daily to improve your score.</p>
          </div>

          {/* Quick Vitals */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Vitals</h3>
            <div className="space-y-3">
              {displayVitals.map((vital, i) => {
                const meta = vitalIcons[vital.label] || { icon: Activity, color: "text-gray-500", bg: "bg-gray-50" };
                const Icon = meta.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className={`w-9 h-9 ${meta.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">{vital.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{vital.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", field: "name", icon: User, type: "text" },
                { label: "Email Address", field: "email", icon: Mail, type: "email" },
                { label: "Phone Number", field: "phone", icon: Phone, type: "tel" },
                { label: "Date of Birth", field: "dob", icon: Calendar, type: "date" },
                { label: "Height", field: "height", icon: Activity, type: "text" },
                { label: "Weight", field: "weight", icon: Activity, type: "text" },
              ].map(({ label, field, icon: Icon, type }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={type}
                      value={profile[field as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Blood Type</label>
                <select
                  value={profile.bloodType}
                  onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Allergies</label>
                <input
                  type="text"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g. Peanuts, Penicillin"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Medical Conditions</label>
                <textarea
                  value={profile.conditions}
                  onChange={(e) => setProfile({ ...profile, conditions: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g. Diabetes, Hypertension"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 resize-none transition-all"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Health Radar + Medical History */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Wellness Radar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Medical History</h3>
              <div className="space-y-2.5">
                {medicalHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.condition}</p>
                      <p className="text-xs text-gray-500">Since {item.year}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {emergencyContacts.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Emergency Contacts
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {emergencyContacts.map((c, i) => (
                  <div key={i} className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-red-600 font-medium mb-1">{c.relation}</p>
                    <p className="text-xs text-gray-600">{c.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {notifications.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700">{notif.label}</span>
                    <button
                      onClick={() => toggleNotif(notif)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notif.enabled ? "bg-indigo-600" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${notif.enabled ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Security & Privacy</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm">
                <Lock className="w-4 h-4" />
                Change Password
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm">
                <Shield className="w-4 h-4" />
                Enable 2FA
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Export My Data
              </button>
            </div>
            <p className="text-xs text-indigo-600 mt-3">Your data is encrypted with AES-256 and stored in HIPAA-compliant infrastructure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

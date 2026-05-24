import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Sparkles,
  User,
  LogOut,
  Bell,
  Heart,
  Activity,
  Shield,
} from "lucide-react";
import { profileApi, symptomsApi, aiApi } from "../services/api";

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [userName, setUserName] = useState<string>(stored.name || "");
  const [userEmail, setUserEmail] = useState<string>(stored.email || "");
  const [activeSymptoms, setActiveSymptoms] = useState<number>(0);
  const [aiSuggestionsCount, setAiSuggestionsCount] = useState<number>(0);

  useEffect(() => {
    if (!stored.name || !stored.email) {
      profileApi.get().then((res) => {
        if (res.data?.name) setUserName(res.data.name);
        if (res.data?.email) setUserEmail(res.data.email);
      }).catch(() => {});
    }
    symptomsApi.getCount().then((res) => {
      setActiveSymptoms(res.active || 0);
    }).catch(() => {});
    aiApi.getCount().then((res) => {
      setAiSuggestionsCount(res.count || 0);
    }).catch(() => {});
  }, []);

  const initials = userName
    ? userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { path: "/user", label: "Dashboard", icon: LayoutDashboard },
    { path: "/user/add-symptoms", label: "Add Symptoms", icon: PlusCircle },
    { path: "/user/history", label: "Health History", icon: History },
    { path: "/user/ai-suggestions", label: "AI Suggestions", icon: Sparkles },
    { path: "/user/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col border-r border-gray-100">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">HealthAI</h1>
              <p className="text-xs text-indigo-500 font-medium">Symptom Tracker</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{userName || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-gray-600">Health Score</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">85%</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
                {item.label === "AI Suggestions" && aiSuggestionsCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-purple-100 text-purple-600 rounded-full text-xs flex items-center justify-center font-bold">
                    {aiSuggestionsCount > 9 ? "9+" : aiSuggestionsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {/* HIPAA Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-700 font-medium">HIPAA Compliant</span>
          </div>

          {/* Notifications */}
          <Link
            to="/user"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {activeSymptoms > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {activeSymptoms > 9 ? "9+" : activeSymptoms}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Notifications</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Live Health Monitoring Active</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Last sync: Just now</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-indigo-600 font-medium text-xs">Encrypted</span>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

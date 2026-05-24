import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  AlertTriangle,
  Bell,
  Heart,
  Shield,
  Zap,
  Settings,
} from "lucide-react";
import { adminApi } from "../services/api";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [severeCases, setSevereCases]     = useState<number>(0);
  const [pendingAlerts, setPendingAlerts] = useState<number>(0);
  const [activePatients, setActivePatients] = useState<number>(0);

  useEffect(() => {
    adminApi.getCounts().then((res) => {
      if (res.success) {
        setSevereCases(res.severeCases);
        setPendingAlerts(res.pendingAlerts);
        setActivePatients(res.activePatients);
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { path: "/admin",              label: "Dashboard",          icon: LayoutDashboard },
    { path: "/admin/monitoring",   label: "User Monitoring",    icon: Users },
    { path: "/admin/severe-cases", label: "Severe Cases",       icon: AlertTriangle,
      badge: severeCases > 0 ? (severeCases > 9 ? "9+" : String(severeCases)) : undefined,
      badgeColor: "bg-red-500" },
    { path: "/admin/alerts",       label: "Alert Management",   icon: Bell,
      badge: pendingAlerts > 0 ? (pendingAlerts > 9 ? "9+" : String(pendingAlerts)) : undefined,
      badgeColor: "bg-orange-500" },
    { path: "/admin/reports",      label: "Reports & Analytics", icon: BarChart3 },
  ];

  const services = [
    { name: "Auth Service",   status: "up" },
    { name: "AI Engine",      status: "up" },
    { name: "Notify Service", status: "up" },
    { name: "Data Sync",      status: "up" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col border-r border-gray-100">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">HealthAI</h1>
              <p className="text-xs text-red-500 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Admin User</p>
              <p className="text-xs text-red-500 font-medium">Super Admin</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`w-5 h-5 ${item.badgeColor} text-white rounded-full text-xs flex items-center justify-center font-bold`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Microservices Status */}
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-gray-700">Microservices</span>
          </div>
          <div className="space-y-1.5">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{svc.name}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${svc.status === "up" ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-xs font-medium ${svc.status === "up" ? "text-green-600" : "text-red-600"}`}>
                    {svc.status === "up" ? "Online" : "Down"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-700 font-medium">HIPAA Compliant · TLS 1.3</span>
          </div>
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{activePatients} active patients monitored</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {severeCases > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-red-600 font-medium text-xs">{severeCases} Critical {severeCases === 1 ? "Case" : "Cases"}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-indigo-600 font-medium text-xs">RBAC Active</span>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

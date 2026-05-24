import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Shield, LayoutDashboard, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authApi } from "../services/api";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.adminLogin(email, password);
      navigate(res.redirectTo);
    } catch (err: any) {
      setError(err.message || "Access denied. Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">

        {/* Left: Admin Branding Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center text-white space-y-8">
          {/* Logo area */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl mb-6 shadow-2xl shadow-red-500/30">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-lg">Healthcare SaaS Control Center</p>
          </div>

          {/* Feature highlights */}
          <div className="w-full max-w-sm space-y-4">
            {[
              { label: "Real-time Patient Monitoring", sub: "Live health metrics & risk alerts" },
              { label: "Microservices Dashboard", sub: "Auth, AI, Data, Notify services" },
              { label: "HIPAA Compliance Oversight", sub: "Audit logs & data security controls" },
              { label: "AI Engine Analytics", sub: "Query volume & accuracy tracking" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security badges */}
          <div className="flex gap-3">
            <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold rounded-full">
              RBAC Active
            </span>
            <span className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold rounded-full">
              TLS 1.3
            </span>
            <span className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full">
              HIPAA
            </span>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-rose-700 rounded-2xl mb-4 shadow-lg shadow-red-500/30 lg:hidden">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <LayoutDashboard className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Admin Access</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 mt-1 text-sm">Authorized personnel only</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-gray-300 font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                  placeholder="admin@hospital.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-300 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500" />
                <span className="text-gray-400">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-[1.02] font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
            <p className="text-xs text-center text-gray-400">
              <span className="text-gray-300 font-semibold">Demo:</span> Use any email containing "admin" (e.g. admin@hospital.com)
            </p>
          </div>

          {/* Back to user login */}
          <p className="text-center mt-5 text-gray-500 text-sm">
            Not an admin?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

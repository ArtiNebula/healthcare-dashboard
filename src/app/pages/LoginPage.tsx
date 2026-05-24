import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Shield, Zap } from "lucide-react";
import { authApi } from "../services/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("userId", String(res.user.id));
      navigate(res.redirectTo);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Animated SVG Illustration */}
        <div className="hidden lg:block relative">
          <div className="relative">
            <svg
              viewBox="0 0 600 600"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#6366f1" }} />
                  <stop offset="100%" style={{ stopColor: "#a855f7" }} />
                </linearGradient>
                <linearGradient id="doctorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#4f46e5" }} />
                  <stop offset="100%" style={{ stopColor: "#7c3aed" }} />
                </linearGradient>
              </defs>

              {/* Background circles */}
              <circle cx="300" cy="300" r="250" fill="url(#loginGradient)" opacity="0.1">
                <animate attributeName="r" values="250;260;250" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="300" r="200" fill="url(#loginGradient)" opacity="0.1">
                <animate attributeName="r" values="200;210;200" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Doctor/Medical Professional */}
              <g transform="translate(200, 150)">
                {/* Head */}
                <circle cx="100" cy="80" r="40" fill="#fbbf24" />
                {/* Body */}
                <rect x="70" y="120" width="60" height="100" rx="30" fill="url(#doctorGradient)" />
                {/* White coat */}
                <path d="M 75 130 L 75 220 L 80 220 L 80 130 Z" fill="white" opacity="0.9" />
                <path d="M 120 130 L 120 220 L 125 220 L 125 130 Z" fill="white" opacity="0.9" />
                {/* Arms */}
                <rect x="40" y="140" width="30" height="60" rx="15" fill="#fbbf24" />
                <rect x="130" y="140" width="30" height="60" rx="15" fill="#fbbf24" />
                {/* Stethoscope */}
                <circle cx="85" cy="180" r="8" fill="#ef4444" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <path d="M 85 180 Q 85 160 100 150" stroke="#ef4444" strokeWidth="3" fill="none" />
              </g>

              {/* Floating medical icons */}
              <g opacity="0.7">
                <circle cx="100" cy="150" r="35" fill="#dbeafe">
                  <animate attributeName="cy" values="150;130;150" dur="3s" repeatCount="indefinite" />
                </circle>
                <path d="M 100 135 L 100 165 M 85 150 L 115 150" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              </g>

              <g opacity="0.7">
                <circle cx="480" cy="180" r="40" fill="#fae8ff">
                  <animate attributeName="cy" values="180;160;180" dur="4s" repeatCount="indefinite" />
                </circle>
                <rect x="465" y="165" width="30" height="30" rx="5" fill="none" stroke="#a855f7" strokeWidth="4" />
                <path d="M 475 175 L 480 180 L 490 168" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* AI Brain Icon */}
              <g transform="translate(400, 350)">
                <circle cx="50" cy="50" r="45" fill="#c7d2fe">
                  <animate attributeName="r" values="45;48;45" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Brain pattern */}
                <path d="M 30 40 Q 35 30 45 35 T 65 40" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 30 50 Q 40 45 50 50 T 70 50" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 35 60 Q 45 55 55 60 T 65 60" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* AI sparkles */}
                <g opacity="0.8">
                  <circle cx="30" cy="30" r="3" fill="#818cf8">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="70" cy="35" r="3" fill="#818cf8">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                  <circle cx="45" cy="70" r="3" fill="#818cf8">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="1s" />
                  </circle>
                </g>
              </g>

              {/* Health Monitor Display */}
              <g transform="translate(80, 380)">
                <rect x="0" y="0" width="180" height="120" rx="15" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="0" y="0" width="180" height="35" rx="15" fill="#6366f1" />
                <text x="90" y="22" fontSize="12" fill="white" textAnchor="middle">Health Monitor</text>

                {/* Heart rate line */}
                <path d="M 20 80 L 40 80 L 45 60 L 50 100 L 55 80 L 160 80"
                      stroke="#ef4444"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round">
                  <animate attributeName="d"
                    values="M 20 80 L 40 80 L 45 60 L 50 100 L 55 80 L 160 80;
                            M 20 80 L 40 80 L 45 65 L 50 95 L 55 80 L 160 80;
                            M 20 80 L 40 80 L 45 60 L 50 100 L 55 80 L 160 80"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
                <text x="90" y="105" fontSize="11" fill="#6b7280" textAnchor="middle">Real-time Monitoring</text>
              </g>

              {/* Security Badge */}
              <g transform="translate(450, 480)">
                <circle cx="40" cy="40" r="38" fill="#dcfce7" />
                <path d="M 40 15 L 50 20 L 50 40 Q 50 55 40 60 Q 30 55 30 40 L 30 20 Z"
                      fill="#22c55e"
                      stroke="#16a34a"
                      strokeWidth="2" />
                <path d="M 35 38 L 38 42 L 46 32"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round" />
              </g>
            </svg>
          </div>

          {/* Floating badges */}
          <div className="absolute top-20 left-10 bg-white rounded-xl shadow-xl p-3 animate-float">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-sm font-semibold text-gray-700">Secure Login</div>
            </div>
          </div>

          <div className="absolute bottom-40 right-10 bg-white rounded-xl shadow-xl p-3 animate-float-delayed">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div className="text-sm font-semibold text-gray-700">Instant Access</div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl mb-2 font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your health dashboard</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 font-semibold"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>

          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs text-center text-indigo-800">
              <strong>Demo Access:</strong> Enter any email and password to access the user dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

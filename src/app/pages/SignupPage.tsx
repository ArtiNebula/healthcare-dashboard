import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, CheckCircle2, Sparkles } from "lucide-react";
import { authApi } from "../services/api";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      await authApi.signup(name, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Animated Benefits Section */}
        <div className="hidden lg:block relative">
          <div className="relative">
            <svg
              viewBox="0 0 600 700"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="signupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#a855f7" }} />
                  <stop offset="100%" style={{ stopColor: "#6366f1" }} />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle cx="300" cy="350" r="280" fill="url(#signupGradient)" opacity="0.1">
                <animate attributeName="r" values="280;290;280" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Main signup illustration - Mobile phone with app */}
              <g transform="translate(180, 80)">
                {/* Phone frame */}
                <rect x="0" y="0" width="240" height="480" rx="30" fill="#1f2937" />
                <rect x="10" y="10" width="220" height="460" rx="25" fill="white" />

                {/* Phone notch */}
                <rect x="80" y="15" width="80" height="20" rx="10" fill="#1f2937" />

                {/* App Screen */}
                <g transform="translate(10, 40)">
                  {/* Header */}
                  <rect x="0" y="0" width="220" height="60" rx="15" fill="url(#signupGradient)" />
                  <text x="110" y="35" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">Health Tracker</text>

                  {/* Stats Cards */}
                  <g transform="translate(0, 80)">
                    <rect x="10" y="0" width="95" height="80" rx="12" fill="#dbeafe" />
                    <text x="57" y="25" fontSize="12" fill="#1e40af" textAnchor="middle">Steps Today</text>
                    <text x="57" y="55" fontSize="24" fill="#1e40af" textAnchor="middle" fontWeight="bold">8,432</text>
                    <circle cx="30" cy="25" r="4" fill="#3b82f6">
                      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>

                  <g transform="translate(115, 80)">
                    <rect x="0" y="0" width="95" height="80" rx="12" fill="#fef3c7" />
                    <text x="47" y="25" fontSize="12" fill="#92400e" textAnchor="middle">Heart Rate</text>
                    <text x="47" y="55" fontSize="24" fill="#b45309" textAnchor="middle" fontWeight="bold">72</text>
                    <circle cx="20" cy="25" r="4" fill="#f59e0b">
                      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>

                  {/* AI Suggestion Card */}
                  <g transform="translate(0, 180)">
                    <rect x="10" y="0" width="200" height="100" rx="12" fill="#f3e8ff" />
                    <text x="110" y="25" fontSize="11" fill="#6b21a8" textAnchor="middle" fontWeight="bold">AI Suggestion</text>
                    <text x="110" y="50" fontSize="10" fill="#7c3aed" textAnchor="middle">Great progress! Consider</text>
                    <text x="110" y="68" fontSize="10" fill="#7c3aed" textAnchor="middle">drinking more water</text>

                    {/* Sparkle icon */}
                    <g transform="translate(180, 10)">
                      <circle cx="0" cy="0" r="12" fill="#a855f7">
                        <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </g>

                  {/* Activity list */}
                  <g transform="translate(0, 300)">
                    <rect x="10" y="0" width="200" height="35" rx="8" fill="#dcfce7" />
                    <circle cx="25" cy="17" r="6" fill="#22c55e" />
                    <text x="40" y="22" fontSize="10" fill="#166534">Logged symptoms</text>

                    <rect x="10" y="45" width="200" height="35" rx="8" fill="#dbeafe" />
                    <circle cx="25" cy="62" r="6" fill="#3b82f6" />
                    <text x="40" y="67" fontSize="10" fill="#1e40af">Health improving</text>
                  </g>
                </g>
              </g>

              {/* Floating feature badges */}
              <g transform="translate(50, 200)">
                <circle cx="0" cy="0" r="45" fill="#dcfce7">
                  <animate attributeName="cy" values="0;-20;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <path d="M -10 -5 L -5 5 L 10 -10" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x="0" y="30" fontSize="10" fill="#166534" textAnchor="middle">Free</text>
              </g>

              <g transform="translate(500, 250)">
                <circle cx="0" cy="0" r="45" fill="#fef3c7">
                  <animate attributeName="cy" values="0;-20;0" dur="3.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <text x="0" y="35" fontSize="10" fill="#92400e" textAnchor="middle">24/7</text>
              </g>

              {/* Benefits list */}
              <g transform="translate(50, 600)">
                {[
                  "AI-Powered Health Insights",
                  "Real-time Symptom Tracking",
                  "Secure & HIPAA Compliant",
                ].map((benefit, idx) => (
                  <g key={idx} transform={`translate(0, ${idx * 35})`}>
                    <circle cx="15" cy="0" r="12" fill="#c7d2fe" />
                    <path d="M 10 0 L 13 3 L 20 -4" stroke="#6366f1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="35" y="5" fontSize="14" fill="#4f46e5" fontWeight="500">{benefit}</text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Signup Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl mb-2 font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600">Start your AI-powered health journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long</p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="relative my-6">
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
              Sign up with Google
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            {[
              "Free forever, no credit card required",
              "End-to-end encrypted data",
              "AI-powered health insights",
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle, Send } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl mb-3 font-bold text-gray-900">Check Your Email</h2>
            <p className="text-gray-600 mb-2">
              We've sent password reset instructions to
            </p>
            <p className="font-semibold text-indigo-600 mb-6">{email}</p>
            <p className="text-sm text-gray-500 mb-8">
              Please check your inbox and click the reset link. If you don't receive an email within a few minutes, check your spam folder.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <linearGradient id="forgotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#6366f1" }} />
                  <stop offset="100%" style={{ stopColor: "#a855f7" }} />
                </linearGradient>
              </defs>

              {/* Background circles */}
              <circle cx="300" cy="300" r="250" fill="url(#forgotGradient)" opacity="0.1">
                <animate attributeName="r" values="250;260;250" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="300" r="200" fill="url(#forgotGradient)" opacity="0.1">
                <animate attributeName="r" values="200;210;200" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Large envelope */}
              <g transform="translate(150, 180)">
                <rect x="0" y="0" width="300" height="200" rx="15" fill="white" stroke="#e5e7eb" strokeWidth="4" />
                <path d="M 0 0 L 150 120 L 300 0" fill="#6366f1" opacity="0.1" />
                <path d="M 0 0 L 150 120 L 300 0" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <animate attributeName="stroke-dasharray" values="0,1000;450,1000" dur="2s" fill="freeze" />
                </path>

                {/* Envelope flap */}
                <path d="M 0 0 L 150 100 L 300 0 Z" fill="#a855f7" opacity="0.9">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="-20 150 0"
                    to="0 150 0"
                    dur="1.5s"
                    fill="freeze"
                  />
                </path>
              </g>

              {/* Email icon flying */}
              <g opacity="0.8">
                <circle cx="100" cy="150" r="35" fill="#dbeafe">
                  <animate attributeName="cy" values="150;130;150" dur="3s" repeatCount="indefinite" />
                </circle>
                <rect x="82" y="138" width="36" height="24" rx="4" fill="#3b82f6" />
                <path d="M 82 138 L 100 152 L 118 138" fill="white" />
              </g>

              {/* Lock opening */}
              <g transform="translate(420, 200)">
                <circle cx="40" cy="50" r="45" fill="#fef3c7">
                  <animate attributeName="r" values="45;48;45" dur="2s" repeatCount="indefinite" />
                </circle>
                <rect x="20" y="55" width="40" height="45" rx="8" fill="#f59e0b" />
                <circle cx="40" cy="40" r="18" fill="none" stroke="#f59e0b" strokeWidth="5" />
                <path d="M 22 40 L 22 55" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round">
                  <animate attributeName="d" values="M 22 40 L 22 55;M 22 35 L 22 40;M 22 40 L 22 55" dur="3s" repeatCount="indefinite" />
                </path>
                <circle cx="40" cy="75" r="4" fill="#fef3c7" />
                <rect x="38" y="75" width="4" height="10" fill="#fef3c7" />
              </g>

              {/* Shield with checkmark */}
              <g transform="translate(100, 420)">
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

              {/* Sparkles */}
              <g>
                <circle cx="480" cy="450" r="4" fill="#818cf8">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="500" cy="380" r="4" fill="#818cf8">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="80" cy="500" r="4" fill="#818cf8">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="1s" />
                </circle>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Forgot Password Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl mb-2 font-bold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-600">No worries, we'll send you reset instructions</p>
          </div>

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
              <p className="mt-2 text-sm text-gray-500">
                Enter the email address associated with your account
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-center text-blue-800">
              <strong>Security Tip:</strong> If you don't receive an email, check your spam folder or contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

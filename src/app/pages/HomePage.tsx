import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Activity, Brain, FileText, Sparkles, Shield, TrendingUp, LayoutDashboard } from "lucide-react";
import { homeApi } from "../services/api";

const iconMap: Record<string, any> = { Activity, Brain, FileText };

export function HomePage() {
  const [heroStats, setHeroStats] = useState<{ value: string; label: string; color: string }[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<{ heartRate: number; symptomsLogged: number; healthTrend: string; aiSuggestions: number } | null>(null);
  const [features, setFeatures] = useState<{ icon: string; title: string; description: string; color: string }[]>([]);
  const [services, setServices] = useState<{ name: string; status: string; uptime: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeApi.get()
      .then((res) => {
        setHeroStats(res.data.heroStats);
        setLiveMetrics(res.data.liveMetrics);
        setFeatures(res.data.features);
        setServices(res.data.services);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-indigo-600 font-medium">Loading health data…</p>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-700">AI-Powered Healthcare SaaS</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Your Health with{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Monitor symptoms in real-time, get AI-powered health insights, and take control of
              your wellness journey with our intelligent microservices platform.
            </p>

            {/* Hero Stats from API */}
            <div className="flex gap-8 mb-8">
              {heroStats.map((stat, i) => (
                <div key={i}>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-lg font-medium transform hover:scale-105"
              >
                Get Started Free
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/admin-login"
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:text-red-600 hover:shadow-lg transition-all duration-300 text-lg font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                Admin Portal
              </Link>
            </div>
          </div>

          {/* Right: Animated SVG — live metrics from API */}
          <div className="relative">
            <div className="relative z-10">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-auto drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#818cf8", stopOpacity: 0.1 }} />
                    <stop offset="100%" style={{ stopColor: "#c084fc", stopOpacity: 0.2 }} />
                  </linearGradient>
                  <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#6366f1" }} />
                    <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
                  </linearGradient>
                </defs>

                <circle cx="250" cy="250" r="200" fill="url(#bgGradient)">
                  <animate attributeName="r" values="200;210;200" dur="4s" repeatCount="indefinite" />
                </circle>

                {/* Dashboard Card */}
                <rect x="100" y="80" width="300" height="360" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="100" y="80" width="300" height="50" rx="20" fill="url(#cardGradient)" />
                <circle cx="130" cy="105" r="5" fill="white" opacity="0.8" />
                <circle cx="150" cy="105" r="5" fill="white" opacity="0.8" />
                <circle cx="170" cy="105" r="5" fill="white" opacity="0.8" />

                {/* Heart Rate — dynamic */}
                <g>
                  <rect x="120" y="150" width="130" height="80" rx="10" fill="#fef3c7" />
                  <text x="135" y="175" fontSize="12" fill="#92400e">Heart Rate</text>
                  <text x="135" y="205" fontSize="24" fontWeight="bold" fill="#b45309">
                    {liveMetrics?.heartRate ?? "—"}
                  </text>
                  <text x="175" y="205" fontSize="14" fill="#b45309">bpm</text>
                  <g transform="translate(210, 185)">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#ef4444"
                      transform="scale(0.8)"
                    >
                      <animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite" />
                    </path>
                  </g>
                </g>

                {/* AI Status */}
                <g>
                  <rect x="270" y="150" width="110" height="80" rx="10" fill="#ddd6fe" />
                  <text x="285" y="175" fontSize="12" fill="#5b21b6">AI Status</text>
                  <circle cx="310" cy="200" r="15" fill="#8b5cf6">
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="285" y="220" fontSize="10" fill="#5b21b6">Active</text>
                </g>

                {/* Live metric rows — dynamic */}
                <rect x="120" y="250" width="260" height="35" rx="8" fill="#dbeafe" />
                <circle cx="140" cy="267.5" r="8" fill="#3b82f6" />
                <text x="160" y="272" fontSize="12" fill="#1e40af">
                  Logged {liveMetrics?.symptomsLogged ?? "—"} symptoms today
                </text>

                <rect x="120" y="300" width="260" height="35" rx="8" fill="#dcfce7" />
                <circle cx="140" cy="317.5" r="8" fill="#22c55e" />
                <text x="160" y="322" fontSize="12" fill="#166534">
                  Health trend: {liveMetrics?.healthTrend ?? "—"}
                </text>

                <rect x="120" y="350" width="260" height="35" rx="8" fill="#fee2e2" />
                <circle cx="140" cy="367.5" r="8" fill="#ef4444" />
                <text x="160" y="372" fontSize="12" fill="#991b1b">
                  {liveMetrics?.aiSuggestions ?? "—"} AI suggestions ready
                </text>

                {/* Floating decoration */}
                <g opacity="0.6">
                  <circle cx="80" cy="150" r="20" fill="#c7d2fe">
                    <animate attributeName="cy" values="150;130;150" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="73" y="158" fontSize="20" fill="#4f46e5">+</text>
                </g>
                <g opacity="0.6">
                  <circle cx="420" cy="300" r="25" fill="#fae8ff">
                    <animate attributeName="cy" values="300;280;300" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M 420 290 L 420 310 M 410 300 L 430 300" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Pulse Wave */}
                <path d="M 50 450 Q 100 450 150 430 T 250 450 T 350 430 T 450 450" stroke="#818cf8" strokeWidth="3" fill="none" opacity="0.4">
                  <animate attributeName="d"
                    values="M 50 450 Q 100 450 150 430 T 250 450 T 350 430 T 450 450;
                            M 50 450 Q 100 430 150 450 T 250 430 T 350 450 T 450 430;
                            M 50 450 Q 100 450 150 430 T 250 450 T 350 430 T 450 450"
                    dur="3s" repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-10 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Security</div>
                  <div className="font-semibold text-green-600">HIPAA Compliant</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-20 -left-4 bg-white rounded-xl shadow-xl p-4 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Real-time</div>
                  <div className="font-semibold text-blue-600">Live Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — from API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Microservices-Powered Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built on modern cloud architecture with independent, scalable services
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Activity;
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-indigo-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-block">
                  Learn more →
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Microservices Section — from API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white my-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Cloud-Native Architecture</h2>
          <p className="text-xl opacity-90">
            Built with modern microservices for scalability and reliability
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">{service.name}</div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div className="text-sm opacity-75">{service.status}</div>
              <div className="text-2xl font-bold mt-2">{service.uptime}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

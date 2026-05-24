import { useState, useEffect } from "react";
import {
  Brain, Shield, Stethoscope, AlertTriangle, ChevronRight,
  Zap, TrendingUp, Clock, CheckCircle2, RefreshCw,
  ChevronDown, ChevronUp, Star, Activity,
} from "lucide-react";
import { aiApi } from "../../services/api";

const priorityConfig: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  high:   { bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700",       dot: "bg-red-500"    },
  medium: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  low:    { bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-700",   dot: "bg-green-500"  },
};

export function AISuggestionPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [expandedCondition, setExpandedCondition] = useState<number | null>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});

  const fetchAnalysis = () => {
    aiApi.getAnalysis().then((r) => setAnalysis(r.data)).catch(console.error);
  };

  useEffect(() => { fetchAnalysis(); }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalysis();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const setFeedbackForRec = (index: number, helpful: boolean) => {
    setFeedback((prev) => ({ ...prev, [index]: helpful }));
  };

  if (!analysis)
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Running AI analysis...</p>
        </div>
      </div>
    );

  const { conditions, recommendations, doctorTriggers, confidence, sparklineData } = analysis;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-600 font-medium">AI Health Suggestions</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Insights</h1>
            <p className="text-gray-500">Personalized analysis based on your recent symptom logs</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* AI Analysis Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Analysis Complete</h2>
              <p className="text-sm opacity-90">Based on: Headache (Moderate, 2hrs), Fatigue (Mild, 18hrs)</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm opacity-90">AI Engine v3.2 · {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{confidence}%</div>
            <div className="text-sm opacity-75">Confidence Score</div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs opacity-75 mb-1.5">
            <span>Analysis Confidence</span>
            <span>{confidence}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${confidence}%` }} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/20">
          {[
            { label: "Conditions Analyzed", value: "3", icon: Activity },
            { label: "Recommendations", value: "6", icon: CheckCircle2 },
            { label: "Risk Level", value: "Low", icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1">
                <Icon className="w-5 h-5 opacity-80" />
              </div>
              <div className="font-bold text-lg">{value}</div>
              <div className="text-xs opacity-75">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Possible Conditions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-600" />
            Possible Conditions
          </h2>

          {conditions.map((cond, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <button
                type="button"
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedCondition(expandedCondition === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    cond.color === "blue" ? "bg-blue-100" : cond.color === "yellow" ? "bg-yellow-100" : "bg-orange-100"
                  }`}>
                    <Brain className={`w-6 h-6 ${
                      cond.color === "blue" ? "text-blue-600" : cond.color === "yellow" ? "text-yellow-600" : "text-orange-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cond.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Severity: {cond.severity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Confidence Ring */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{cond.confidence}%</div>
                    <div className="text-xs text-gray-500">confidence</div>
                  </div>
                  {expandedCondition === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Confidence bar under header */}
              <div className="px-5 pb-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cond.color === "blue" ? "bg-blue-500" : cond.color === "yellow" ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${cond.confidence}%` }}
                  />
                </div>
              </div>

              {expandedCondition === i && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{cond.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Likely Causes</h4>
                      <ul className="space-y-1.5">
                        {cond.causes.map((c, ci) => (
                          <li key={ci} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                              {ci + 1}
                            </div>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Suggested Treatments</h4>
                      <ul className="space-y-1.5">
                        {cond.treatments.map((t, ti) => (
                          <li key={ti} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Doctor Visit Triggers */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-red-500" />
              When to See a Doctor
            </h3>
            <div className="space-y-2">
              {doctorTriggers.map((rec: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${rec.urgency === "Emergency" ? "text-red-600" : rec.urgency === "Immediate" ? "text-orange-600" : "text-yellow-600"}`} />
                    <span className="text-sm text-gray-700">{rec.trigger}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-3 ${
                    rec.urgency === "Emergency" ? "bg-red-100 text-red-700" :
                    rec.urgency === "Immediate" ? "bg-orange-100 text-orange-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {rec.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recommendations */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            AI Recommendations
          </h2>

          {recommendations.map((rec: any, i: number) => {
            const config = priorityConfig[rec.priority] || priorityConfig.low;
            const fb = feedback[i];
            return (
              <div key={i} className={`rounded-2xl p-4 border ${config.bg} ${config.border}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{rec.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rec.detail}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {rec.time}
                      </div>
                      {fb === undefined ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 mr-1">Helpful?</span>
                          <button onClick={() => setFeedbackForRec(i, true)} className="text-green-600 hover:bg-green-100 rounded p-0.5 transition-colors">
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setFeedbackForRec(i, false)} className="text-red-400 hover:bg-red-100 rounded p-0.5 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">{fb ? "Thanks!" : "Noted"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Health Trend */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-semibold">Health Trend</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">Based on 14 days of data, your health score is improving.</p>
            <div className="flex items-end gap-1 h-12">
              {(sparklineData || []).map((d: any, i: number) => {
                const max = Math.max(...(sparklineData || []).map((x: any) => x.score));
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-white/40"
                    style={{ height: `${(d.score / max) * 100}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs opacity-70 mt-1">
              <span>14 days ago</span>
              <span>Today: {sparklineData?.at(-1)?.score ?? "--"}%</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              AI suggestions are for informational purposes only and do not constitute medical advice. Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

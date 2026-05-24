import { useState } from "react";
import {
  Calendar,
  AlertCircle,
  Brain,
  Plus,
  X,
  Thermometer,
  Clock,
  CheckCircle2,
  Zap,
  ChevronRight,
} from "lucide-react";

const SYMPTOM_CATEGORIES = {
  "Head & Neurological": ["Headache", "Migraine", "Dizziness", "Blurred Vision", "Memory Issues", "Confusion"],
  "Respiratory": ["Cough", "Shortness of Breath", "Chest Tightness", "Wheezing", "Sore Throat", "Runny Nose"],
  "Digestive": ["Nausea", "Vomiting", "Abdominal Pain", "Diarrhea", "Constipation", "Bloating"],
  "General": ["Fatigue", "Fever", "Chills", "Body Ache", "Weakness", "Loss of Appetite"],
  "Cardiovascular": ["Chest Pain", "Rapid Heart Rate", "Palpitations", "Swelling", "High BP"],
  "Mental Health": ["Anxiety", "Stress", "Insomnia", "Depression", "Mood Swings"],
};

const SEVERITY_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Very Mild", color: "text-green-600", bg: "bg-green-100" },
  2: { label: "Mild", color: "text-green-600", bg: "bg-green-100" },
  3: { label: "Mild", color: "text-green-500", bg: "bg-green-100" },
  4: { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" },
  5: { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" },
  6: { label: "Moderate", color: "text-orange-500", bg: "bg-orange-100" },
  7: { label: "Severe", color: "text-orange-600", bg: "bg-orange-100" },
  8: { label: "Severe", color: "text-red-500", bg: "bg-red-100" },
  9: { label: "Critical", color: "text-red-600", bg: "bg-red-100" },
  10: { label: "Emergency", color: "text-red-700", bg: "bg-red-200" },
};

export function AddSymptomsPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [temperature, setTemperature] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("hours");
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Head & Neurological");

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedSymptoms([]);
      setSeverity(5);
      setNotes("");
      setTemperature("");
      setDuration("");
    }, 3000);
  };

  const severityInfo = SEVERITY_LABELS[severity] || SEVERITY_LABELS[5];
  const severityPercent = (severity / 10) * 100;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      {/* Success Toast */}
      {submitted && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-2xl px-6 py-4 rounded-2xl animate-fade-in">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Symptoms Logged!</p>
            <p className="text-sm text-gray-500">AI analysis started...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600 font-medium">Log Symptoms</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Your Symptoms</h1>
        <p className="text-gray-500">Select symptoms and our AI will analyze patterns for personalized health insights.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Symptom Selector */}
          <div className="lg:col-span-2 space-y-6">

            {/* Selected Symptoms Pills */}
            {selectedSymptoms.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Selected Symptoms</h3>
                  <span className="text-sm text-indigo-600 font-medium">{selectedSymptoms.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium"
                    >
                      {s}
                      <button type="button" onClick={() => toggleSymptom(s)}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom Categories */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Select Symptoms</h3>
                <p className="text-sm text-gray-500 mt-1">Choose all symptoms you are currently experiencing</p>
              </div>

              {/* Category Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-100 px-4 gap-1 pt-3">
                {Object.keys(SYMPTOM_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                      activeCategory === cat
                        ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Symptoms Grid */}
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SYMPTOM_CATEGORIES[activeCategory as keyof typeof SYMPTOM_CATEGORIES].map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Slider */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pain / Severity Level</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityInfo.bg} ${severityInfo.color}`}>
                  {severity}/10 — {severityInfo.label}
                </span>
              </div>

              <div className="relative mb-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${severityPercent * 0.5}%, #ef4444 ${severityPercent}%, #e5e7eb ${severityPercent}%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span className="text-green-600 font-medium">1 - Minimal</span>
                <span className="text-yellow-600 font-medium">5 - Moderate</span>
                <span className="text-red-600 font-medium">10 - Emergency</span>
              </div>

              {/* Emoji scale */}
              <div className="flex justify-between mt-2">
                {["😊", "🙂", "😐", "😟", "😣"].map((emoji, i) => (
                  <span key={i} className={`text-lg transition-all ${Math.ceil(severity / 2) === i + 1 ? "scale-150" : "opacity-40"}`}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Additional Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm transition-all"
                rows={4}
                placeholder="Describe how you feel in detail — when did it start, triggers, anything unusual..."
              />
              <p className="text-xs text-gray-400 mt-2">The more detail you provide, the better the AI analysis.</p>
            </div>
          </div>

          {/* Right: Details & Submit */}
          <div className="space-y-5">
            {/* Date & Time */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">When did this start?</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Duration</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="minutes">min</option>
                      <option value="hours">hrs</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Vitals (Optional)</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Body Temperature</label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full pl-9 pr-16 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="98.6"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">°F</span>
                </div>
                {temperature && parseFloat(temperature) > 100.4 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Above normal — consider medical attention
                  </p>
                )}
              </div>
            </div>

            {/* AI Analysis Preview */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5" />
                <h3 className="font-semibold">AI Analysis Ready</h3>
              </div>
              {selectedSymptoms.length > 0 ? (
                <>
                  <p className="text-sm opacity-90 mb-3">
                    {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? "s" : ""} detected. AI will analyze patterns and generate personalized insights.
                  </p>
                  <div className="space-y-2">
                    {["Pattern Analysis", "Risk Assessment", "Recommendations"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="opacity-90">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm opacity-75">Select symptoms above to enable AI analysis</p>
              )}
            </div>

            {/* Emergency Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                If experiencing a medical emergency, call <strong>911</strong> immediately. Do not rely solely on this app for emergencies.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={selectedSymptoms.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Log Symptoms & Analyze
            </button>
            {selectedSymptoms.length === 0 && (
              <p className="text-xs text-center text-gray-400">Select at least one symptom to continue</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

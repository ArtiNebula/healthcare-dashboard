import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { HomePage } from "../app/pages/HomePage";
import * as api from "../app/services/api";

vi.mock("../app/services/api", () => ({
  homeApi: {
    get: vi.fn(),
  },
}));

const mockHomeData = {
  success: true,
  data: {
    heroStats: [
      { value: "10K+", label: "Patients", color: "blue" },
      { value: "99%", label: "Accuracy", color: "green" },
    ],
    liveMetrics: { heartRate: 72, symptomsLogged: 5, healthTrend: "Improving", aiSuggestions: 3 },
    features: [
      { icon: "Activity", title: "AI Analysis", description: "Smart health insights", color: "from-indigo-500 to-indigo-600" },
    ],
    services: [
      { name: "API", status: "operational", uptime: "99.9%" },
    ],
  },
};

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.homeApi.get).mockResolvedValue(mockHomeData);
  });

  it("renders without crashing", () => {
    renderHome();
  });

  it("renders Get Started link", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });

  it("renders Admin Portal link", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /admin portal/i })).toBeInTheDocument();
  });
});

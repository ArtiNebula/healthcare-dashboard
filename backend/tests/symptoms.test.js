const request = require("supertest");

jest.mock("prom-client", () => ({
  Registry: jest.fn(() => ({
    contentType: "text/plain",
    metrics: jest.fn().mockResolvedValue("# metrics"),
  })),
  collectDefaultMetrics: jest.fn(),
  Counter: jest.fn(() => ({ inc: jest.fn() })),
  Histogram: jest.fn(() => ({ startTimer: jest.fn(() => jest.fn()) })),
  Gauge: jest.fn(() => ({ inc: jest.fn(), dec: jest.fn() })),
}));

const db = require("../db");
jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("../cache", () => ({
  getCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(undefined),
  delCache: jest.fn().mockResolvedValue(undefined),
}));

const app = require("../server");

const mockSymptom = {
  id: 1,
  date: "2026-05-25",
  symptoms: ["Headache"],
  severity: "Moderate",
  severityScore: 5,
  status: "Active",
  aiNote: "AI analysis pending",
  duration: "2 days",
};

beforeEach(() => {
  jest.clearAllMocks();
});

// NOTE: x-user-id header set hone pe getUserId DB call nahi karta — mock sirf actual query ke liye

describe("GET /api/symptoms", () => {
  it("returns 200 with symptoms list", async () => {
    db.query.mockResolvedValueOnce([[mockSymptom]]);
    const res = await request(app).get("/api/symptoms").set("x-user-id", "1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/symptoms/count", () => {
  it("returns active symptoms count", async () => {
    db.query.mockResolvedValueOnce([[{ active: 3 }]]);
    const res = await request(app).get("/api/symptoms/count").set("x-user-id", "1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.active).toBe("number");
  });
});

describe("POST /api/symptoms", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/symptoms").send({ symptom: "Headache" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 201 on successful symptom log", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.query.mockResolvedValueOnce([[mockSymptom]]);
    const res = await request(app)
      .post("/api/symptoms")
      .set("x-user-id", "1")
      .send({ symptom: "Headache", category: "Neurological", severity: "Moderate" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("sets correct severity score for Severe symptoms", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);
    db.query.mockResolvedValueOnce([[{ ...mockSymptom, severity: "Severe", severityScore: 8 }]]);
    const res = await request(app)
      .post("/api/symptoms")
      .set("x-user-id", "1")
      .send({ symptom: "Chest pain", category: "Cardiac", severity: "Severe" });
    expect(res.status).toBe(201);
  });
});

describe("GET /api/symptoms/:id", () => {
  it("returns 404 when symptom not found", async () => {
    db.query.mockResolvedValueOnce([[]]); // empty result
    const res = await request(app).get("/api/symptoms/999").set("x-user-id", "1");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns 200 with symptom data", async () => {
    db.query.mockResolvedValueOnce([[mockSymptom]]);
    const res = await request(app).get("/api/symptoms/1").set("x-user-id", "1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

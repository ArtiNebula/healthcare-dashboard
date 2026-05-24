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
jest.mock("../db", () => ({ query: jest.fn() }));
jest.mock("../cache", () => ({
  getCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(undefined),
  delCache: jest.fn().mockResolvedValue(undefined),
}));

const app = require("../server");

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe("Healthcare API running");
    expect(res.body.timestamp).toBeDefined();
  });
});

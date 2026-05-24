const request = require("supertest");

jest.mock("prom-client", () => ({
  Registry: jest.fn(() => ({
    contentType: "text/plain; version=0.0.4; charset=utf-8",
    metrics: jest.fn().mockResolvedValue("# HELP process_cpu_seconds_total\n# TYPE process_cpu_seconds_total counter\nprocess_cpu_seconds_total 0.1\n"),
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

describe("GET /api/metrics", () => {
  it("returns 200 with prometheus text format", async () => {
    const res = await request(app).get("/api/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
  });

  it("response body contains metric data", async () => {
    const res = await request(app).get("/api/metrics");
    expect(typeof res.text).toBe("string");
    expect(res.text.length).toBeGreaterThan(0);
  });
});

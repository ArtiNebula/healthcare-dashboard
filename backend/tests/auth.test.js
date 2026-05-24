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

const mockUser = { id: 1, name: "Test User", email: "test@example.com", password: "password123", role: "patient" };
const mockAdmin = { id: 2, name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" };

describe("POST /api/auth/login", () => {
  it("returns 400 when email or password missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "test@example.com" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 when user not found", async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).post("/api/auth/login").send({ email: "notfound@example.com", password: "pass" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 when password is wrong", async () => {
    db.query.mockResolvedValueOnce([[mockUser]]);
    const res = await request(app).post("/api/auth/login").send({ email: mockUser.email, password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 200 on successful login with plain-text password", async () => {
    db.query.mockResolvedValueOnce([[mockUser]]);
    db.query.mockResolvedValueOnce([[]]); // hash upgrade query
    const res = await request(app).post("/api/auth/login").send({ email: mockUser.email, password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(mockUser.email);
    expect(res.body.redirectTo).toBe("/user");
  });
});

describe("POST /api/auth/admin-login", () => {
  it("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/auth/admin-login").send({ email: "admin@example.com" });
    expect(res.status).toBe(400);
  });

  it("returns 401 when admin not found", async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).post("/api/auth/admin-login").send({ email: "noone@example.com", password: "pass" });
    expect(res.status).toBe(401);
  });

  it("returns 200 on successful admin login", async () => {
    db.query.mockResolvedValueOnce([[mockAdmin]]);
    db.query.mockResolvedValueOnce([[]]); // hash upgrade
    const res = await request(app).post("/api/auth/admin-login").send({ email: mockAdmin.email, password: "admin123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.redirectTo).toBe("/admin");
  });
});

describe("POST /api/auth/signup", () => {
  it("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({ name: "Test" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 409 when email already exists", async () => {
    db.query.mockResolvedValueOnce([[{ id: 1 }]]);
    const res = await request(app).post("/api/auth/signup").send({ name: "Test", email: "exists@example.com", password: "pass123" });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("returns 201 on successful signup", async () => {
    db.query.mockResolvedValueOnce([[]]); // no existing user
    db.query.mockResolvedValueOnce([{ insertId: 10 }]); // insert
    const res = await request(app).post("/api/auth/signup").send({ name: "New User", email: "new@example.com", password: "pass123" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("returns 400 when email is missing", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
  });

  it("returns 200 with confirmation message", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({ email: "user@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

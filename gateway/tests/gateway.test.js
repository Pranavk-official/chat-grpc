const request = require("supertest");
const app = require("../src/app");

describe("Gateway API", () => {
  it("should respond to health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
  });

  it("should send a message", async () => {
    const res = await request(app)
      .post("/api/chat/send")
      .send({ senderId: "123", recipientId: "456", content: "Hello!" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should get messages", async () => {
    const res = await request(app).get("/api/chat/messages/123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("messages");
  });

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({ username: "test", email: "test@example.com", password: "test" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ username: "test", password: "test" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get a user", async () => {
    const res = await request(app).get("/api/user/123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
  });
});

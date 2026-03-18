import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

const { sendWelcomeMail } = await import("../src/services/mail.service.js");
const { default: app } = await import("../src/app.js");

import request from "supertest";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../testUtils/setupTestDb.helper.js";

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
  jest.clearAllMocks();
});

afterAll(async () => {
  await closeDatabase();
});

describe("POST /api/user/signup", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  it("should create a new user successfully", async () => {
    const res = await request(app).post("/api/user/signup").send(validUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe(validUser.email);
  });

  it("should return error if all fields are empty", async () => {
    const res = await request(app).post("/api/user/signup").send({});

    expect(res.statusCode).toBe(400);
  });

  it("should return error if name is missing", async () => {
    const res = await request(app).post("/api/user/signup").send({
      email: "test@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return error if email is missing", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "test",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should fail if password is less than 6 characters", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "test",
      email: "test@gmail.com",
      password: "12345",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should fail if user already exists", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    const res = await request(app).post("/api/user/signup").send(validUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Your account already exist please login");
  });

  it("should set token cookie after signup", async () => {
    const res = await request(app).post("/api/user/signup").send(validUser);

    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should call sendWelcomeMail after signup", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    expect(sendWelcomeMail).toHaveBeenCalled();
  });
});

describe("POST /api/user/login", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  const loginUser = {
    email: "test@gmail.com",
    password: "123456",
  };

  it("should login user successfully", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    const result = await request(app)
      .post("/api/user/login")
      .send(loginUser);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("_id");
    expect(result.body.email).toBe(validUser.email);
  });

  it("all fields are required", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({});

    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("All fields are required");
  });

  it("should fail if user does not exist", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "no@gmail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Your account does not exist Please SignUp"
    );
  });

  it("should fail if password is incorrect", async () => {
    await request(app)
      .post("/api/user/signup")
      .send(validUser);

    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: validUser.email,
        password: "wrong123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please enter correct Password");
  });
});

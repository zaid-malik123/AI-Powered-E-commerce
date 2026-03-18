import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

const { sendWelcomeMail, sendOtpMail } = await import("../src/services/mail.service.js");
const { default: app } = await import("../src/app.js");

import request from "supertest";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../testUtils/setupTestDb.helper.js";
// import { sendOtpMail } from "../src/services/mail.service.js";

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

    const result = await request(app).post("/api/user/login").send(loginUser);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("_id");
    expect(result.body.email).toBe(validUser.email);
  });

  it("all fields are required", async () => {
    const res = await request(app).post("/api/user/login").send({});

    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("All fields are required");
  });

  it("should fail if user does not exist", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "no@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Your account does not exist Please SignUp");
  });

  it("should fail if password is incorrect", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    const res = await request(app).post("/api/user/login").send({
      email: validUser.email,
      password: "wrong123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please enter correct Password");
  });
});

describe("GET /api/user/logout", () => {
  it("should logout user successfully", async () => {
  const res = await request(app).get("/api/user/logout");

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Logout successfully");

  expect(res.headers["set-cookie"]).toBeDefined();
  expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
});
});

describe("GET /api/user/currUser", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  it("should return current user if authenticated", async () => {
    const signupRes = await request(app)
      .post("/api/user/signup")
      .send(validUser);
    const token = signupRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    const res = await request(app)
      .get("/api/user/currUser")
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(validUser.email);
  });

  it("should return error if not authenticated", async () => {
    const res = await request(app).get("/api/user/currUser");

    expect(res.statusCode).toBe(401);
  });
});

describe("POST /api/user/send-otp", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  it("should send OTP successfully", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    const res = await request(app)
      .post("/api/user/send-otp")
      .send({ email: validUser.email });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("OTP send successfully 👍");
  });

  it("should return error if user does not exist", async () => {
    const res = await request(app)
      .post("/api/user/send-otp")
      .send({ email: "nonexistent@gmail.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("user email not found",);
  });

  it("should return error if email is invalid", async () => {
    const res = await request(app)
      .post("/api/user/send-otp")
      .send({ email: "invalid-email" });

    expect(res.statusCode).toBe(400);
  });

  it("should call sendOtpMail", async () => {
  await request(app).post("/api/user/signup").send(validUser);

  await request(app)
    .post("/api/user/send-otp")
    .send({ email: validUser.email });

  expect(sendOtpMail).toHaveBeenCalled();

  expect(sendOtpMail).toHaveBeenCalledWith(
    validUser.email,
    expect.any(String)
  );
});
});

describe("POST /api/user/verify-otp", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  it("should verify OTP successfully", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    await request(app)
      .post("/api/user/send-otp")
      .send({ email: validUser.email });

    const User = (await import("../src/models/user.model.js")).default;
    const user = await User.findOne({ email: validUser.email });

    const otp = user.resetOtp;

    const res = await request(app)
      .post("/api/user/verify-otp")
      .send({ email: validUser.email, otp });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("OTP verify successfully 👍");
  });

  it("should return error if OTP is invalid", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    const res = await request(app)
      .post("/api/user/verify-otp")
      .send({ email: validUser.email, otp: "123456" });

    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("Invalid OTP");
  });

  it("should return error if user does not exist", async () => {
    const res = await request(app)
      .post("/api/user/verify-otp")
      .send({ email: "nonexistent@gmail.com", otp: "123456" });

    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("Your account does not exist Please SignUp");
  });
});

describe("POST /api/user/reset", () => {
  const validUser = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  it("should reset password successfully", async () => {
    await request(app).post("/api/user/signup").send(validUser);

    // Send OTP first
    await request(app)
      .post("/api/user/send-otp")
      .send({ email: validUser.email });

    // Verify OTP
    const User = (await import("../src/models/user.model.js")).default;
    const user = await User.findOne({ email: validUser.email });
    const otp = user.resetOtp;

    await request(app)
      .post("/api/user/verify-otp")
      .send({ email: validUser.email, otp });

    // Reset password
    const res = await request(app)
      .post("/api/user/reset")
      .send({ email: validUser.email, password: "newpassword123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("password reset successfully");
  });

  it("should return error if password is too short", async () => {
  await request(app).post("/api/user/signup").send(validUser);

  await request(app)
    .post("/api/user/send-otp")
    .send({ email: validUser.email });

  const User = (await import("../src/models/user.model.js")).default;
  const user = await User.findOne({ email: validUser.email });

  await request(app)
    .post("/api/user/verify-otp")
    .send({ email: validUser.email, otp: user.resetOtp });

  const res = await request(app)
    .post("/api/user/reset")
    .send({ email: validUser.email, password: "123" });

  expect(res.statusCode).toBe(400);
  // expect(res.body.message).toBe("password must be at least 6 characters");
});

  it("should return error if user does not exist", async () => {
    const res = await request(app)
      .post("/api/user/reset")
      .send({ email: "nonexistent@gmail.com", password: "newpassword123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Your account does not exist Please SignUp");
  });

  it("should return error if email is invalid", async () => {
    const res = await request(app)
      .post("/api/user/reset")
      .send({ email: "invalid-email", password: "newpassword123" });

    expect(res.statusCode).toBe(400);
  });
});

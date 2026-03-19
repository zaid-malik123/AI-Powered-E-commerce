import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { jest } from "@jest/globals"; // ✅ clean import

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

jest.unstable_mockModule("razorpay", () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      orders: {
        create: jest.fn().mockResolvedValue({
          id: "order_test_123",
          amount: 10000,
          currency: "INR",
        }),
      },
    })),
  };
});

// ✅ 2. Import mocked module
const mailModule = await import("../src/services/mail.service.js");
const { sendPaymentSuccessMail } = mailModule;

// ❌ REMOVE resetModules

// ✅ 3. THEN import app
const { default: app } = await import("../src/app.js");

import request from "supertest";
import crypto from "crypto";

import { connect, closeDatabase } from "../testUtils/setupTestDb.helper.js";

let token;

beforeAll(async () => {
  jest.setTimeout(15000); // 🔥 timeout fix

  await connect();

  await request(app).post("/api/user/signup").send({
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  });

  const res = await request(app).post("/api/user/login").send({
    email: "test@gmail.com",
    password: "123456",
  });

  token = res.headers["set-cookie"];
});

afterAll(async () => {
  await closeDatabase();
});

describe("PAYMENT API", () => {

  it("should verify payment and create order", async () => {
    const razorpay_order_id = "order_test_123";
    const razorpay_payment_id = "payment_test_123";

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpay_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const res = await request(app)
      .post("/api/payment/verify")
      .set("Cookie", token)
      .send({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items: [
          {
            product: "507f1f77bcf86cd799439011",
            title: "Test Product",
            price: 100,
            quantity: 1,
          },
        ],
        address: {
          street: "Test street",
          city: "Delhi",
          country: "India",
        },
        totalAmount: 100,
      });

    expect(sendPaymentSuccessMail).toHaveBeenCalled();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
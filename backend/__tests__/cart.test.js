import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

import request from "supertest";
// import app from "../src/app.js";

import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../testUtils/setupTestDb.helper.js";

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/user.model.js");
const { sendWelcomeMail } = await import("../src/services/mail.service.js");
// import { sendWelcomeMail }  from "../src/services/mail.service.js";

beforeAll(async () => {
  await connect();
});

// afterEach(async () => {
//   await clearDatabase();
//   jest.clearAllMocks();
// });

afterAll(async () => {
  await closeDatabase();
});

describe("POST /api/cart/add", () => {

  let adminToken;
  let userToken;
  let productId;

  const adminPayload = {
    name: "admin",
    email: "admin@test.com",
    password: "admin123",
  };

  const userPayload = {
    name: "test",
    email: "test@gmail.com",
    password: "123456",
  };

  const loginUser = {
    email: "test@gmail.com",
    password: "123456",
  };

  const productPayload = {
    name: "Test Product",
    description: "A product used in tests",
    category: "Men",
    subCategory: "Topwear",
    price: 100,
    sizes: ["M"],
  };

  beforeAll(async () => {
    await request(app).post("/api/user/signup").send(adminPayload);

    await User.findOneAndUpdate(
      { email: adminPayload.email },
      { $set: { role: "admin" } }
    );

    const adminLogin = await request(app).post("/api/user/login").send({
      email: adminPayload.email,
      password: adminPayload.password,
    });

    adminToken = adminLogin.headers["set-cookie"];

    // product create
    const productRes = await request(app)
      .post("/api/product/create")
      .set("Cookie", adminToken)
      .send(productPayload);

    productId = productRes.body.product._id;

    await request(app).post("/api/user/signup").send(userPayload);

    const userLogin = await request(app).post("/api/user/login").send(loginUser);

    userToken = userLogin.headers["set-cookie"];
  });

  it("should add product to cart", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", userToken)
      .send({
        productId,
        quantity: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item added to cart");
    expect(res.body.cart.items.length).toBe(1);
  });

  it("should increase quantity if product already exists", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", userToken)
      .send({
        productId,
        quantity: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(3);
  });

  it("should fail for invalid quantity", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", userToken)
      .send({
        productId,
        quantity: 0,
      });
    //   console.log(res)
    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("Invalid productId or quantity");
  });

  it("should fail if productId is missing", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", userToken)
      .send({
        quantity: 1,
      });

    expect(res.statusCode).toBe(400);
  });

  it("should fail if product does not exist", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", userToken)
      .send({
        productId: "507f1f77bcf86cd799439011", // fake id
        quantity: 1,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should fail if user not logged in", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .send({
        productId,
        quantity: 1,
      });

    expect(res.statusCode).toBe(401);
  });

});

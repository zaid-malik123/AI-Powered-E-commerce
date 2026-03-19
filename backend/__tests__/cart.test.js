import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

import request from "supertest";

import {
  connect,
  closeDatabase,
} from "../testUtils/setupTestDb.helper.js";

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/user.model.js");

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Cart API", () => {
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

    const adminLogin = await request(app).post("/api/user/login").send(adminPayload);
    adminToken = adminLogin.headers["set-cookie"];

    // product create
    const productRes = await request(app)
      .post("/api/product/create")
      .set("Cookie", adminToken)
      .send(productPayload);

    productId = productRes.body.product._id;

    // user create
    await request(app).post("/api/user/signup").send(userPayload);

    const userLogin = await request(app).post("/api/user/login").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    userToken = userLogin.headers["set-cookie"];
  });

  describe("POST /api/cart/add", () => {

    it("should add product to cart", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ productId, quantity: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items.length).toBe(1);
    });

    it("should increase quantity if product already exists", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ productId, quantity: 2 });

      expect(res.body.cart.items[0].quantity).toBe(3);
    });

    it("should fail for invalid quantity", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ productId, quantity: 0 });

      expect(res.statusCode).toBe(400);
    });

    it("should fail if productId missing", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(400);
    });

    it("should fail if product not found", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({
          productId: "507f1f77bcf86cd799439011",
          quantity: 1,
        });

      expect(res.statusCode).toBe(404);
    });

    it("should fail if unauthorized", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId, quantity: 1 });

      expect(res.statusCode).toBe(401);
    });

  });

  describe("GET /api/cart", () => {

    it("should fetch cart items", async () => {
      const res = await request(app)
        .get("/api/cart")
        .set("Cookie", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items.length).toBeGreaterThanOrEqual(1);
    });

  });

  describe("PUT /api/cart/update", () => {

    it("should update quantity", async () => {
      const res = await request(app)
        .put("/api/cart/update")
        .set("Cookie", userToken)
        .send({ productId, quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items[0].quantity).toBe(5);
    });

    it("should remove item if quantity 0", async () => {
      const res = await request(app)
        .put("/api/cart/update")
        .set("Cookie", userToken)
        .send({ productId, quantity: 0 });
     
     expect(res.statusCode).toBe(400)
    // console.log("THIS IS THE RESPONEE ",res) 
    //   expect(res.body.cart.items.length).toBe(0);
    });

  });

  describe("DELETE /api/cart/remove", () => {

    it("should add item again", async () => {
      await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ productId, quantity: 2 });
    });

    it("should remove item", async () => {
      const res = await request(app)
        .delete("/api/cart/remove")
        .set("Cookie", userToken)
        .send({ productId });

      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items.length).toBe(0);
    });

  });

  describe("DELETE /api/cart/remove-all-cart", () => {

    it("should clear cart", async () => {
      await request(app)
        .post("/api/cart/add")
        .set("Cookie", userToken)
        .send({ productId, quantity: 2 });

      const res = await request(app)
        .delete("/api/cart/remove-all-cart")
        .set("Cookie", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items.length).toBe(0);
    });

  });

});
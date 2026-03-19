import { describe, expect, jest as jestGlobals } from "@jest/globals";

const jest = globalThis.jest ?? jestGlobals;

process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendWelcomeMail: jest.fn(),
  sendOtpMail: jest.fn(),
  sendOrderConfirmationMail: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/user.model.js");
const { default: Product } = await import("../src/models/product.model.js");
const { default: Order } = await import("../src/models/order.model.js");
const { genToken } = await import("../src/config/genToken.js");

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

const createUserCookie = async (overrides = {}) => {
  const user = await User.create({
    name: "test-user",
    email: `user-${Date.now()}@e2e.test`,
    password: "hashedpassword",
    role: "user",
    ...overrides,
  });

  const token = await genToken(user._id, user.role);
  return { cookie: `token=${token}`, user };
};

const createAdminCookie = async () => {
  const admin = await User.create({
    name: "admin",
    email: `admin-${Date.now()}@e2e.test`,
    password: "hashedpassword",
    role: "admin",
  });

  const token = await genToken(admin._id, admin.role);
  return `token=${token}`;
};

describe("Order API", () => {
  const productPayload = {
    name: "Order Test Product",
    description: "Product for order tests",
    category: "Men",
    subCategory: "Topwear",
    price: 50,
    sizes: ["M"],
  };

  it("creates an order (COD) and updates product totalSold", async () => {
    const { cookie } = await createUserCookie();
    const product = await Product.create({ ...productPayload });

    const items = [{ product: product._id, quantity: 2, price: product.price }];

    const res = await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items, address: "123 Test St", totalAmount: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order.items.length).toBe(1);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.totalSold).toBe(2);
  });

  it("returns 400 when items are empty", async () => {
    const { cookie } = await createUserCookie();

    const res = await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items: [], address: "addr", totalAmount: 0 });

    console.log("THS IS THE RES " ,res)  
    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("Cart is empty");
  });

  it("returns 400 when address is missing", async () => {
    const { cookie } = await createUserCookie();
    const product = await Product.create({ ...productPayload });

    const items = [{ product: product._id, quantity: 1, price: product.price }];

    const res = await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items, totalAmount: product.price });

    expect(res.statusCode).toBe(400);
    // expect(res.body.message).toBe("Address is required");
  });

  it("fetches user orders", async () => {
    const { cookie } = await createUserCookie();
    const product = await Product.create({ ...productPayload });
    const items = [{ product: product._id, quantity: 1, price: product.price }];

    await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items, address: "A", totalAmount: product.price });

    const res = await request(app).get("/api/order/").set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
    expect(res.body.orders[0].items[0].product._id).toBe(product._id.toString());
  });

  it("allows admin to fetch all orders", async () => {
    const { cookie } = await createUserCookie();
    const adminCookie = await createAdminCookie();
    const product = await Product.create({ ...productPayload });

    const items = [{ product: product._id, quantity: 1, price: product.price }];

    await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items, address: "A", totalAmount: product.price });

    const res = await request(app).get("/api/order/all").set("Cookie", adminCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
  });

  it("rejects invalid status updates and accepts valid ones", async () => {
    const { cookie } = await createUserCookie();
    const adminCookie = await createAdminCookie();
    const product = await Product.create({ ...productPayload });
    const items = [{ product: product._id, quantity: 1, price: product.price }];

    const createRes = await request(app)
      .post("/api/order/create")
      .set("Cookie", cookie)
      .send({ items, address: "A", totalAmount: product.price });

    const orderId = createRes.body.order._id;

    const badRes = await request(app)
      .post(`/api/order/update-status/${orderId}`)
      .set("Cookie", adminCookie)
      .send({ status: "InvalidStatus" });

    expect(badRes.statusCode).toBe(400);
    expect(badRes.body.message).toBe("Invalid order status");

    const okRes = await request(app)
      .post(`/api/order/update-status/${orderId}`)
      .set("Cookie", adminCookie)
      .send({ status: "Shipped" });

    expect(okRes.statusCode).toBe(200);
    expect(okRes.body.order.orderStatus).toBe("Shipped");
  });
});


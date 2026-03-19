import { describe, expect, jest as jestGlobals } from "@jest/globals";

const jest = globalThis.jest ?? jestGlobals;

// Ensure JWT_SECRET is available for token generation in tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

jest.unstable_mockModule("../src/services/imageKit.service.js", () => ({
  uploadImage: jest.fn().mockResolvedValue({ url: "http://test.img" }),
}));

jest.unstable_mockModule("../src/config/createVector.js", () => ({
  generateVector: jest.fn().mockResolvedValue(Array.from({ length: 768 }, () => 0.1)),
}));

jest.unstable_mockModule("../src/services/pincone.service.js", () => ({
  index: {
    upsert: jest.fn().mockResolvedValue({}),
    query: jest.fn().mockResolvedValue({ matches: [] }),
  },
}));

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/user.model.js");
const { default: Product } = await import("../src/models/product.model.js");
const { genToken } = await import("../src/config/genToken.js");
const { index } = await import("../src/services/pincone.service.js");

import request from "supertest";
import {
  connect,
  closeDatabase,
  clearDatabase
} from "../src/testUtils/setupTestDb.helper.js";

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

const createAdminCookie = async () => {
  const admin = await User.create({
    name: "admin",
    email: "admin@e2e.test",
    password: "hashedpassword",
    role: "admin",
  });

  const token = await genToken(admin._id, admin.role);
  return `token=${token}`;
};

describe("Product API", () => {
  const productPayload = {
    name: "Test Product",
    description: "A product used in tests",
    category: "Men",
    subCategory: "Topwear",
    price: 123,
    sizes: ["M", "L"],
  };

  describe("POST /api/product/create", () => {
    it("should reject if not authenticated", async () => {
      const res = await request(app)
        .post("/api/product/create")
        .field("name", productPayload.name)
        .field("description", productPayload.description)
        .field("category", productPayload.category)
        .field("subCategory", productPayload.subCategory)
        .field("price", productPayload.price.toString())
        .field("sizes", JSON.stringify(productPayload.sizes));

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });

    it("should reject if user is not admin", async () => {
      const user = await User.create({
        name: "user",
        email: "user@e2e.test",
        password: "hashedpassword",
        role: "user",
      });
      const token = await genToken(user._id, user.role);
      const cookie = `token=${token}`;

      const res = await request(app)
        .post("/api/product/create")
        .set("Cookie", cookie)
        .field("name", productPayload.name)
        .field("description", productPayload.description)
        .field("category", productPayload.category)
        .field("subCategory", productPayload.subCategory)
        .field("price", productPayload.price.toString())
        .field("sizes", JSON.stringify(productPayload.sizes));

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Admin access only");
    });

    it("should create a new product when admin", async () => {
      const cookie = await createAdminCookie();

      const res = await request(app)
        .post("/api/product/create")
        .set("Cookie", cookie)
        .field("name", productPayload.name)
        .field("description", productPayload.description)
        .field("category", productPayload.category)
        .field("subCategory", productPayload.subCategory)
        .field("price", productPayload.price.toString())
        .field("sizes", JSON.stringify(productPayload.sizes));

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product created successfully");
      expect(res.body.product).toMatchObject({
        name: productPayload.name,
        category: productPayload.category,
      });
      expect(index.upsert).toHaveBeenCalled();
    });
  });

  describe("GET /api/product/all", () => {
    it("should return an empty list when no products", async () => {
      const res = await request(app).get("/api/product/all");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should return created products", async () => {
      await Product.create({ ...productPayload });
      const res = await request(app).get("/api/product/all");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(productPayload.name);
    });
  });

  describe("GET /api/product/:id", () => {
    it("should return 404 for missing product", async () => {
      const res = await request(app).get("/api/product/000000000000000000000000");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Product not found");
    });

    it("should return a product by id", async () => {
      const product = await Product.create({ ...productPayload });
      const res = await request(app).get(`/api/product/${product._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product._id).toBe(product._id.toString());
    });
  });

  describe("DELETE /api/product/delete/:id", () => {
    it("should delete product when admin", async () => {
      const cookie = await createAdminCookie();
      const product = await Product.create({ ...productPayload });

      const res = await request(app)
        .delete(`/api/product/delete/${product._id}`)
        .set("Cookie", cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product deleted successfully");
    });
  });

  describe("GET /api/product/related/:id", () => {
    it("should return related products", async () => {
      const baseProduct = await Product.create({ ...productPayload });
      const otherProduct = await Product.create({
        ...productPayload,
        name: "Other Product",
      });

      index.query.mockResolvedValueOnce({
        matches: [{ id: otherProduct._id.toString() }],
      });

      const res = await request(app).get(
        `/api/product/related/${baseProduct._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.relatedProducts)).toBe(true);
      expect(res.body.relatedProducts.length).toBe(1);
      expect(res.body.relatedProducts[0]._id).toBe(otherProduct._id.toString());
    });
  });
});

// backend\__test__\auth\error.test.ts

// External Imports
import request from "supertest";
import express, { Express } from "express";
import cookieParser from "cookie-parser";

// Internal Imports
import { protect, admin } from "../../middleware/authMiddleware";
import { errorHandler } from "../../middleware/errorMiddleware";

let server: Express;

beforeAll(() => {
  server = express();
  server.use(cookieParser());
  server.use("/protected", protect, (req, res, next) => res.sendStatus(200));
  server.use("/admin", admin, (req, res, next) => res.sendStatus(200));
  server.use(errorHandler);
});

describe("Authentication Middleware", () => {
  describe("when no token is provided", () => {
    it("should return 401 error and appropriate error message", async () => {
      const response = await request(server).get("/protected");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Not authorized, no token");
    });
  });

  describe("when an invalid token is provided", () => {
    it("should return 401 error and appropriate error message", async () => {
      const response = await request(server)
        .get("/protected")
        .set("Cookie", ["jwt=invalidtoken"]);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Not authorized, token failed");
    });
  });
});

describe("Admin Authorization Middleware", () => {
  describe("when no token is provided", () => {
    it("should return 401 error and appropriate error message", async () => {
      const response = await request(server).get("/admin");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Not authorized as an admin");
    });
  });

  describe("when an invalid token is provided", () => {
    it("should return 401 error and appropriate error message", async () => {
      const response = await request(server)
        .get("/admin")
        .set("Cookie", ["jwt=invalidtoken"]);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Not authorized as an admin");
    });
  });
});

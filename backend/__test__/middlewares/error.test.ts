// backend\__test__\middlewares\error.test.ts

// External Imports
import express from "express";
import request from "supertest";
import { errorHandler } from "../../middleware/errorMiddleware";

describe("Error Middlewares", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use("/test", (req, res) => {
      throw new Error("Test error");
    });

    app.use(errorHandler);
  });

  it("should handle an error and return it in the response", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Test error",
      stack: expect.any(String),
    });
  });
});

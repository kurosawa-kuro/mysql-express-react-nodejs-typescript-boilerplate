// backend\test\app.test.ts

import request from "supertest";
import { app } from "../index";

describe("GET /", () => {
  it("responds with a message indicating the API is running", async () => {
    const response: request.Response = await request(app).get("/api/");
    expect(response.status).toBe(200);
    expect(response.text).toEqual("API is running....");
  });
});

describe("GET /endpoints", () => {
  it("responds with a json array containing endpoint information", async () => {
    const response: request.Response = await request(app).get("/api/endpoints");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    console.log("endpoints", response.body);
    const endpoints = response.body;
    for (const endpoint of endpoints) {
      expect(endpoint).toHaveProperty("path");
      expect(endpoint).toHaveProperty("methods");

      expect(typeof endpoint.path).toBe("string");
      expect(Array.isArray(endpoint.methods)).toBe(true);
    }
  });
});

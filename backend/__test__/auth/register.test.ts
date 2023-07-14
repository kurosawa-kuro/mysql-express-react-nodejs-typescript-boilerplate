// backend\__test__\auth\register.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUserInDB } from "../testUtils";
import { UserData } from "../testData";

describe("POST /api/auth/register", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("registers a new user", async () => {
    const registerResponse = await agent.post("/api/auth/register").send({
      name: UserData.name,
      email: UserData.email,
      password: UserData.password,
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty("id");
    expect(registerResponse.body.email).toEqual(UserData.email);
  });

  it("rejects registration with existing email", async () => {
    await createUserInDB(UserData.email, UserData.password);

    const registerResponse = await agent.post("/api/auth/register").send({
      name: UserData.name,
      email: UserData.email,
      password: UserData.password,
    });

    expect(registerResponse.status).toBe(400);
  });

  it("rejects registration with invalid user data", async () => {
    const registerResponse = await agent
      .post("/api/auth/register")
      .send({ name: UserData.name, email: UserData.email });

    expect(registerResponse.status).toBe(400);
  });
});

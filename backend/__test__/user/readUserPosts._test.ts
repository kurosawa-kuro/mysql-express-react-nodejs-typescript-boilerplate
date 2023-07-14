// // backend/__test__/user/readUserPosts.test.ts

// import request, { SuperAgentTest } from "supertest";
// import { app } from "../../index";
// import {
//   clearDatabase,
//   createUserInDB,
//   loginUserAndGetToken,
// } from "../testUtils";
// import { UserData } from "../testData";
// import { createPost } from "../../controllers/postController";

// describe("GET /api/users/:id/posts", () => {
//   let agent: SuperAgentTest;

//   beforeEach(async () => {
//     await clearDatabase();
//     agent = request.agent(app);
//   });

//   afterEach(async () => {
//     await clearDatabase();
//   });

//   it("reads a user's posts", async () => {
//     const user = await createUserInDB(UserData.email, UserData.password);
//     const token = await loginUserAndGetToken(
//       agent,
//       UserData.email,
//       UserData.password
//     );

//     // Assuming that we have a function to create a post in testUtils
//     // Adjust accordingly based on how you create posts in your app
//     createPost(user.id, "Test Post");

//     expect(token).toBeTruthy();

//     const response = await agent
//       .get(`/api/users/${user.id}/posts`)
//       .set("Cookie", `jwt=${token}`);

//     expect(response.status).toBe(200);
//     // Adjust accordingly based on how the response data is structured
//     expect(response.body.posts[0].content).toEqual("Test Post");
//   });

//   it("rejects unauthenticated access", async () => {
//     const user = await createUserInDB(UserData.email, UserData.password);
//     const response = await agent.get(`/api/users/${user.id}/posts`);

//     expect(response.status).toBe(401);
//   });
// });

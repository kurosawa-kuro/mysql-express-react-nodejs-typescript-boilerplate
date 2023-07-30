// frontend\src\__test__\screen\user\UserScreen.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserScreen } from "../../../screens/user/UserScreen";
import { UserData } from "../../../../../backend/__test__/testData";
import { App } from "../../../App";
import { simulateLogin } from "../../testUtils";

// UserDataにpostやfollowsのデータがないので、調整する
const server = setupServer(
  rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 2,
          name: "User",
          email: "user@email.com",
          password:
            "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
          avatarPath: null,
          isAdmin: false,
          createdAt: "2023-07-10T14:24:43.958Z",
          updatedAt: "2023-07-10T14:24:43.958Z",
          posts: [
            {
              id: 1,
              userId: 2,
              description: "post_description2",
              imagePath: "image_url2",
              createdAt: "2023-07-10T14:24:44.121Z",
              updatedAt: "2023-07-10T14:24:44.121Z",
              user: {
                id: 2,
                name: "User",
                avatarPath: null,
              },
            },
            {
              id: 2,
              userId: 2,
              description: "post_description1",
              imagePath: "image_url1",
              createdAt: "2023-07-10T14:24:44.121Z",
              updatedAt: "2023-07-10T14:24:44.121Z",
              user: {
                id: 2,
                name: "User",
                avatarPath: null,
              },
            },
          ],
          followedBy: [
            {
              id: 2,
              followee: {
                id: 5,
                name: "User4",
                email: "user4@email.com",
              },
            },
            {
              id: 3,
              followee: {
                id: 4,
                name: "User3",
                email: "user3@email.com",
              },
            },
            {
              id: 7,
              followee: {
                id: 3,
                name: "User2",
                email: "user2@email.com",
              },
            },
          ],
          _count: {
            followedBy: 3,
            following: 4,
          },
          isFollowed: false,
          followerCount: 3,
          followeeCount: 4,
        },
        posts: [
          {
            id: 1,
            userId: 2,
            description: "post_description2",
            imagePath: "image_url2",
            createdAt: "2023-07-10T14:24:44.121Z",
            updatedAt: "2023-07-10T14:24:44.121Z",
            user: {
              id: 2,
              name: "User",
              avatarPath: null,
            },
          },
          {
            id: 2,
            userId: 2,
            description: "post_description1",
            imagePath: "image_url1",
            createdAt: "2023-07-10T14:24:44.121Z",
            updatedAt: "2023-07-10T14:24:44.121Z",
            user: {
              id: 2,
              name: "User",
              avatarPath: null,
            },
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const setup = async () => {
  renderScreen();
  await simulateLogin();
};

const renderScreen = () => {
  render(
    <MemoryRouter initialEntries={["/users/1"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/users/:id" element={<UserScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("UserScreen", () => {
  it("renders the UserScreen and shows user details", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText(`Name : ${UserData.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Email : ${UserData.email}`)).toBeInTheDocument();

      expect(screen.getByText(`4 フォロー中`)).toBeInTheDocument();
      expect(screen.getByText(`3 フォロワー`)).toBeInTheDocument();

      expect(screen.getByText(`post_description2`)).toBeInTheDocument();
      expect(screen.getByText(`post_description1`)).toBeInTheDocument();
    });
  });

  it("test Follow", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: false,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      }),
      rest.post(
        "http://localhost:8080/api/users/follow/3",
        (_req, res, ctx) => {
          return res(
            ctx.json({
              id: 46,
              followerId: 3,
              followeeId: 2,
              createdAt: "2023-07-16T01:57:35.200Z",
            })
          );
        }
      ),
      rest.get("http://localhost:8080/api/users/3/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: false,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      })
    );

    await setup();

    const button = await screen.findByRole("button", {
      name: /(Follow|Unfollow)/i,
    });
    fireEvent.click(button);

    // await waitFor(() => {
    //   expect(screen.getByText(`Name : ${UserData.name}`)).toBeInTheDocument();
    //   expect(screen.getByText(`Email : ${UserData.email}`)).toBeInTheDocument();

    //   expect(screen.getByText(`4 フォロー中`)).toBeInTheDocument();
    //   expect(screen.getByText(`3 フォロワー`)).toBeInTheDocument();

    //   expect(screen.getByText(`post_description2`)).toBeInTheDocument();
    //   expect(screen.getByText(`post_description1`)).toBeInTheDocument();
    // });
  });

  it("test Unfollow", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: true,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      }),
      rest.delete(
        "http://localhost:8080/api/users/follow/3",
        (_req, res, ctx) => {
          return res(
            ctx.json({
              id: 46,
              followerId: 3,
              followeeId: 2,
              createdAt: "2023-07-16T01:57:35.200Z",
            })
          );
        }
      ),
      rest.get("http://localhost:8080/api/users/3/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: true,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      })
    );

    await setup();

    const button = await screen.findByRole("button", {
      name: /(Follow|Unfollow)/i,
    });
    fireEvent.click(button);

    // await waitFor(() => {
    //   expect(screen.getByText(`Name : ${UserData.name}`)).toBeInTheDocument();
    //   expect(screen.getByText(`Email : ${UserData.email}`)).toBeInTheDocument();

    //   expect(screen.getByText(`4 フォロー中`)).toBeInTheDocument();
    //   expect(screen.getByText(`3 フォロワー`)).toBeInTheDocument();

    //   expect(screen.getByText(`post_description2`)).toBeInTheDocument();
    //   expect(screen.getByText(`post_description1`)).toBeInTheDocument();
    // });
  });

  it("Fail server test Unfollow", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: true,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      }),
      rest.delete(
        "http://localhost:8080/api/users/follow/3",
        (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "Server Error" }));
        }
      ),
      rest.get("http://localhost:8080/api/users/3/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: true,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      })
    );

    await setup();

    const button = await screen.findByRole("button", {
      name: /(Follow|Unfollow)/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent("Server Error");
    });
  });

  it("server error renders the UserScreen and shows user details", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: 3,
              name: "User",
              email: "user@email.com",
              password:
                "$2a$10$RbWiHaEGQeCMAHwOtqSV6.otv7FUY.9JCwGb1/DkE0Ic.H4vXkHu2",
              avatarPath: null,
              isAdmin: false,
              createdAt: "2023-07-10T14:24:43.958Z",
              updatedAt: "2023-07-10T14:24:43.958Z",
              posts: [
                {
                  id: 1,
                  userId: 2,
                  description: "post_description2",
                  imagePath: "image_url2",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
                {
                  id: 2,
                  userId: 2,
                  description: "post_description1",
                  imagePath: "image_url1",
                  createdAt: "2023-07-10T14:24:44.121Z",
                  updatedAt: "2023-07-10T14:24:44.121Z",
                  user: {
                    id: 2,
                    name: "User",
                    avatarPath: null,
                  },
                },
              ],
              followedBy: [
                {
                  id: 2,
                  followee: {
                    id: 5,
                    name: "User4",
                    email: "user4@email.com",
                  },
                },
                {
                  id: 3,
                  followee: {
                    id: 4,
                    name: "User3",
                    email: "user3@email.com",
                  },
                },
                {
                  id: 7,
                  followee: {
                    id: 3,
                    name: "User2",
                    email: "user2@email.com",
                  },
                },
              ],
              _count: {
                followedBy: 3,
                following: 4,
              },
              isFollowed: false,
              followerCount: 3,
              followeeCount: 4,
            },
            posts: [
              {
                id: 1,
                userId: 2,
                description: "post_description2",
                imagePath: "image_url2",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
              {
                id: 2,
                userId: 2,
                description: "post_description1",
                imagePath: "image_url1",
                createdAt: "2023-07-10T14:24:44.121Z",
                updatedAt: "2023-07-10T14:24:44.121Z",
                user: {
                  id: 2,
                  name: "User",
                  avatarPath: null,
                },
              },
            ],
          })
        );
      }),
      rest.post(
        "http://localhost:8080/api/users/follow/3",
        (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "Server Error" }));
        }
      )
    );

    await setup();

    const button = await screen.findByRole("button", {
      name: /(Follow|Unfollow)/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent("Server Error");
    });
  });
  it("Shows error message when API call fails", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/1/posts", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server Error" }));
      })
    );
    await setup();
    await waitFor(() => {
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent("Server Error");
    });
  });
});

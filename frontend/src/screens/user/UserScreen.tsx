// frontend\src\screens\user\UserScreen.tsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../components/common/Loader";
import {
  createFollow,
  deleteFollow,
  readUserPosts,
  readUserById,
} from "../../services/api";
import { UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";
import { useAuthStore } from "../../state/store";

export const UserScreen: React.FC = () => {
  const { userInfo } = useAuthStore();
  const { id } = useParams();
  const [user, setUser] = useState<UserInfo>({});
  const [posts, setPosts] = useState<
    [
      {
        id: number;
        user: { id: number; name: string };
        description: string;
        imagePath: string;
      }
    ]
  >([
    {
      id: 0,
      user: { id: 0, name: "" },
      description: "",
      imagePath: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readUserByIdAndSet = async () => {
    setLoading(true);
    try {
      const data = await readUserById(Number(id));
      console.log({ data });
      setUser(data);

      const data2 = await readUserPosts(Number(id));
      console.log({ data2 });
      setPosts(data2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFollow = async (id: number) => {
    setLoading(true);
    try {
      if (id) {
        await createFollow(Number(id));
        const data = await readUserById(Number(id));
        setUser(data);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleDeleteFollow = async (id: number) => {
    setLoading(true);
    try {
      if (id) {
        await deleteFollow(Number(id));
        const data = await readUserById(Number(id));
        setUser(data);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    readUserByIdAndSet();
  }, []);

  // return <>{JSON.stringify(posts)}</>;
  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        {userInfo?.id === user.id ? "My Page" : "User"}
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="min-w-full divide-y divide-custom-blue-dark">
        <ul className="divide-y divide-custom-blue-light ">
          <li>
            <div className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              ID : {user.id}
            </div>
          </li>
          <li>
            <div className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              Name : {user.name}
            </div>
          </li>

          <li>
            <div className="whitespace-nowrap px-6 py-4">
              <a
                href={`mailto:${user.email}`}
                className="text-custom-blue-dark hover:text-custom-blue-darker"
              >
                Email : {user.email}
              </a>
            </div>
          </li>

          {userInfo?.id !== user.id && user.id && (
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                Status :{" "}
                <button
                  className={`rounded px-4 py-2 font-bold text-white ${
                    user.isFollowed
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  onClick={() =>
                    user.isFollowed
                      ? handleDeleteFollow(user.id!)
                      : handleCreateFollow(user.id!)
                  }
                >
                  {user.isFollowed ? "Unfollow" : "Follow"}
                </button>
              </div>
            </li>
          )}

          <div className="flex">
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                {user.followeeCount} フォロー中
              </div>
            </li>
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                {user.followerCount} フォロワー
              </div>
            </li>
          </div>
        </ul>

        <table className="min-w-full divide-y divide-custom-blue-dark">
          <thead className="bg-custom-blue-lightest">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                Post
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom-blue-light ">
            {posts.map((post, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                  {post.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                  <Link to={`/users/${post.user.id}`}>{post.user.name}</Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link to={`/posts/${post.id}`}>{post.description}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

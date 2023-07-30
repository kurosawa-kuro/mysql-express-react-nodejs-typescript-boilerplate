// frontend\src\screens\user\UserScreen.tsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../components/common/Loader";
import { createFollow, deleteFollow, readUserPosts } from "../../services/api";

import { Message } from "../../components/common/Message";
import { useAuthStore } from "../../state/store";

export const UserScreen: React.FC = () => {
  const { userInfo } = useAuthStore();
  const { id } = useParams();
  const [userPost, setUserPost] = useState<any>({});
  //   [
  //     {
  //       id: number;
  //       user: { id: number; name: string };
  //       description: string;
  //       imagePath: string;
  //     }
  //   ]
  // >([
  //   {
  //     id: 0,
  //     user: { id: 0, name: "" },
  //     description: "",
  //     imagePath: "",
  //   },
  // ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readUserPostsAndSet = async () => {
    setLoading(true);
    try {
      const data = await readUserPosts(Number(id));

      setUserPost(data);
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

        const data = await readUserPosts(Number(id));
        setUserPost(data);
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
        const data = await readUserPosts(Number(id));
        setUserPost(data);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    readUserPostsAndSet();
  }, []);

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        {userInfo?.id === userPost.id ? "My Page" : "User"}
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="min-w-full divide-y divide-custom-blue-dark">
        <ul className="divide-y divide-custom-blue-light ">
          <li>
            <div className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              ID : {userPost.user?.id}
            </div>
          </li>
          <li>
            <div className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              Name : {userPost.user?.name}
            </div>
          </li>

          <li>
            <div className="whitespace-nowrap px-6 py-4">
              <a
                href={`mailto:${userPost.user?.email}`}
                className="text-custom-blue-dark hover:text-custom-blue-darker"
              >
                Email : {userPost.user?.email}
              </a>
            </div>
          </li>

          {userInfo?.id !== userPost.user?.id && userPost.user?.id && (
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                Status :{" "}
                <button
                  className={`rounded px-4 py-2 font-bold text-white ${
                    userPost.user?.isFollowed
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  onClick={() =>
                    userPost.user?.isFollowed
                      ? handleDeleteFollow(userPost.user?.id!)
                      : handleCreateFollow(userPost.user?.id!)
                  }
                >
                  {userPost.user?.isFollowed ? "Unfollow" : "Follow"}
                </button>
              </div>
            </li>
          )}

          <div className="flex">
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                {userPost.user?.followeeCount} フォロー中
              </div>
            </li>
            <li>
              <div className="whitespace-nowrap px-6 py-4">
                {userPost.user?.followerCount} フォロワー
              </div>
            </li>
          </div>
        </ul>

        <table className="min-w-full divide-y divide-custom-blue-dark">
          <thead className="bg-custom-blue-lightest">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                Post
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom-blue-light ">
            {userPost.posts &&
              userPost.posts?.map(
                (
                  post: {
                    id: number;
                    user: {
                      id: number;
                      name: number;
                    };
                    description: string;
                  },
                  index: React.Key
                ) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`/posts/${post.id}`}>{post.description}</Link>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// frontend\src\screens\post\PostListScreen.tsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/common/Loader";
import { createFollow, readPost, deleteFollow } from "../../services/api";
import { useAuthStore } from "../../state/store";
// import { UserAuth, UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";
// import { toast } from "react-toastify";

export const PostScreen: React.FC = () => {
  const { userInfo } = useAuthStore();

  const { id } = useParams();
  const [post, setPost] = useState({
    id: 0,
    userId: 0,
    user: {
      id: 0,
      name: "",
      email: "",
    },
    description: "",
    isfollowed: false,
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readPostsAndSet = async () => {
    setLoading(true);
    try {
      if (id) {
        const data = await readPost(Number(id));
        console.log("data", data);
        setPost(data);
      }
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
        console.log({ id });
        const debug = await createFollow(Number(id));
        console.log({ debug });
        const data = await readPost(Number(id));
        console.log({ data });
        setPost(data);
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
        const data = await readPost(Number(id));
        setPost(data);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    console.log("userInfo", userInfo);
    if (userInfo) {
      console.log("userInfo.id", userInfo.id);
      if (post.user.id === userInfo.id) {
        console.log("my post");
      }
    }
    readPostsAndSet();
  }, []);

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        {post.user.id === userInfo!.id ? "My Post" : "Post"}
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
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
            {userInfo && post.user.id !== userInfo.id && (
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-custom-blue-light ">
          <tr>
            <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              {post.id}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              {/* Todo自分の投稿の場合はmy-postへリンク分岐 */}
              <Link to={`/users/${post.user.id}`}>{post.user.name}</Link>
            </td>
            <td className="whitespace-nowrap px-6 py-4">{post.description}</td>

            {userInfo && post.user.id !== userInfo.id && (
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  className={`rounded px-4 py-2 font-bold text-white ${
                    post.isfollowed
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  onClick={() =>
                    post.isfollowed
                      ? handleDeleteFollow(post.user.id)
                      : handleCreateFollow(post.user.id)
                  }
                >
                  {post.isfollowed ? "Unfollow" : "Follow"}
                </button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
};

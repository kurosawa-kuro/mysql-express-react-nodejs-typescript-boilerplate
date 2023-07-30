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
    isFollowed: false,
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
      <div className="mx-auto w-full text-center">
        <div className="flex items-center justify-center space-x-4">
          <div>
            Name:
            <Link
              to={`/users/${post.user.id}`}
              className="font-bold text-custom-blue-dark"
            >
              {post.user.name}
            </Link>
          </div>
          <div>
            Status:
            {userInfo && post.user.id !== userInfo.id && (
              <button
                className={`ml-2 rounded px-4 py-2 font-bold text-white ${
                  post.isFollowed
                    ? "bg-custom-red-light hover:bg-custom-red-dark"
                    : "bg-custom-blue-dark  hover:bg-custom-blue-darkest"
                }`}
                onClick={() =>
                  post.isFollowed
                    ? handleDeleteFollow(post.user.id)
                    : handleCreateFollow(post.user.id)
                }
              >
                {post.isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
        <div className="text-custom-blue-extra-darkest">
          Description:{post.description}
        </div>
      </div>
    </>
  );
};

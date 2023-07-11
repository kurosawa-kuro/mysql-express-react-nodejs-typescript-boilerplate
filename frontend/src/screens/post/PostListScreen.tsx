// frontend\src\screens\post\PostListScreen.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/common/Loader";
import { readPosts } from "../../services/api";
// import { useAuthStore } from "../../state/store";
// import { UserAuth, UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";
// import { toast } from "react-toastify";

export const PostListScreen: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: 0,
      userId: 0,
      user: {
        id: 0,
        name: "",
        email: "",
      },
      description: "",
      createdAt: "",
      updatedAt: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readPostsAndSet = async () => {
    setLoading(true);
    try {
      const data = await readPosts();
      setPosts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readPostsAndSet();
  }, []);
  // return <>{posts[0].description}</>;
  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Post list
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
          </tr>
        </thead>
        <tbody className="divide-y divide-custom-blue-light ">
          {posts.map((post, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                {post.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                {/* Todo自分の投稿の場合はmy-postへリンク分岐 */}
                <Link to={`/users/${post.user.id}`}>{post.user.name}</Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/posts/${post.id}`}>{post.description}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

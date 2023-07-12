// frontend\src\screens\user\UserScreen.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/common/Loader";
import { createFollow, deleteFollow, readUserById } from "../../services/api";
import { UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";
import { useAuthStore } from "../../state/store";

export const UserScreen: React.FC = () => {
  const { userInfo } = useAuthStore();
  const { id } = useParams();
  const [user, setUser] = useState<UserInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readUserByIdAndSet = async () => {
    setLoading(true);
    try {
      const data = await readUserById(Number(id));
      setUser(data);
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
        </ul>
      </div>
    </>
  );
};

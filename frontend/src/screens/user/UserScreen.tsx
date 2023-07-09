// frontend\src\screens\user\UserScreen.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/common/Loader";
import { readUserById } from "../../services/api";
import { UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";

export const UserScreen: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser();
  }, []);

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        User
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
        </ul>
      </div>
    </>
  );
};

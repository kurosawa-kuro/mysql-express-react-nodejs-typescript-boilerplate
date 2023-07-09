// frontend\src\screens\admin\user\UserListScreen.tsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
// import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Loader } from "../../components/common/Loader";
// import { toast } from "react-toastify";
import { readUserById } from "../../services/api";
// import { deleteUser, readUser } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { UserAuth, UserInfo } from "../../../../backend/interfaces";

import { Message } from "../../components/common/Message";

export const UserScreen: React.FC = () => {
  // req.params.idを取得する
  const { id } = useParams();
  const [user, setUser] = useState<UserInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuthStore() as UserAuth;

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

  // const deleteHandler = async (id: number) => {
  //   if (window.confirm("Are you sure")) {
  //     try {
  //       await deleteUser(id);
  //       setUser(user.filter((user) => user.id !== id));
  //       toast.success("User deleted successfully");
  //     } catch (err: unknown) {
  //       if (err instanceof Error) {
  //         toast.error(err.message);
  //       }
  //     }
  //   }
  // };

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        User
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
              EMAIL
            </th>
            {userInfo?.isAdmin && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  ADMIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark"></th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-custom-blue-light ">
          <tr>
            <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              {user.id}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
              {user.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              <a
                href={`mailto:${user.email}`}
                className="text-custom-blue-dark hover:text-custom-blue-darker"
              >
                {user.email}
              </a>
            </td>

            {userInfo?.isAdmin && (
              <>
                <td className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  {user.isAdmin ? (
                    <FaCheck className="text-custom-green-light" />
                  ) : (
                    <FaTimes className="text-custom-red-light " />
                  )}
                </td>
                <td>
                  <Link
                    to={`/admin/user/${user.id}/edit`}
                    className="mr-2 inline-flex items-center rounded bg-custom-blue-darker px-2 py-1 text-white hover:bg-custom-blue-darkest"
                  >
                    <FaEdit size={18} className="mr-1" />
                    Edit
                  </Link>
                  {/* <button
                      className="inline-flex items-center rounded bg-custom-red-light px-2 py-1 text-white hover:bg-custom-red-dark"
                      onClick={() => {
                        user && user.id && deleteHandler(user.id);
                      }}
                    >
                      <FaTrash size={18} className="mr-1" />
                      Delete
                    </button> */}
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
};

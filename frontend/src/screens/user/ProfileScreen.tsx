// frontend\src\screens\user\ProfileScreen.tsx

import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Loader } from "../../components/common/Loader";
import { updateUserProfile, uploadImage } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { Message } from "../../components/common/Message";
import { FormContainer } from "../../components/layout/FormContainer";

export const ProfileScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    if (userInfo && userInfo.name && userInfo.email) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setImage(userInfo.avatarPath || "");
    }
  }, [userInfo]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (userInfo) {
        const res = await updateUserProfile({
          name,
          email,
          avatarPath: image,
          password,
          isAdmin: userInfo.isAdmin || false,
        });
        setUserInfo({ ...res });
        toast.success("Profile updated successfully");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadImage(formData);
        toast.success(res.message);
        setImage(res.image);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-2 mt-2 text-center text-3xl font-bold text-custom-blue-dark">
        User Profile
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <form
        onSubmit={submitHandler}
        className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
      >
        <div className="mb-4">
          <label className="text-custom-blue-dark" htmlFor="name">
            Name
          </label>
          <input
            className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-custom-blue-dark" htmlFor="email">
            Email Address
          </label>
          <input
            className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image-file" className="mb-4 text-custom-blue-dark">
            Image File
          </label>
          {image && (
            <img
              className="mt-2 w-40"
              src={image.replace(/\\/g, "/").replace("/frontend/public", "")}
              alt={image}
            />
          )}
          <input
            id="image"
            name="image"
            type="text"
            className="relative block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            placeholder="Enter image url"
            value={image.replace(/\\/g, "/").replace("/frontend/public", "")}
            onChange={(e) => setImage(e.target.value)}
            style={{ display: "none" }}
          />
          <input
            id="image-file"
            name="image-file"
            type="file"
            className="relative mb-4 block w-full appearance-none rounded-none border border-custom-blue-light bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            onChange={uploadFileHandler}
          />
        </div>

        <div className="mb-4">
          <label className="text-custom-blue-dark" htmlFor="password">
            Password
          </label>
          <input
            className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-custom-blue-dark" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-custom-blue-dark px-4 py-2 text-sm font-medium text-white hover:bg-custom-blue-darkest focus:outline-none focus:ring-2 focus:ring-custom-blue-dark focus:ring-offset-2"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

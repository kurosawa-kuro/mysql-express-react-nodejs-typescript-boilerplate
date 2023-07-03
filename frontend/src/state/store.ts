// frontend\src\state\store.ts

import { create } from "zustand";
import { UserAuth } from "../../../backend/interfaces";

export const useAuthStore = create<UserAuth>((set) => {
  const storedUserInfo = localStorage.getItem("userInfo");

  return {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
    setUserInfo: (userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());

      set({ userInfo });
    },
    logout: () => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");

      set({ userInfo: null });
    },
  };
});

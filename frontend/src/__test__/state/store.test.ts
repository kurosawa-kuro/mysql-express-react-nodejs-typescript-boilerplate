// frontend\src\__test__\state\store.test.ts

import { renderHook, act } from "@testing-library/react-hooks";

import { useAuthStore } from "../../state/store";
import { UserData } from "../../../../backend/__test__/testData";

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle setting and clearing user information", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUserInfo(UserData);
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual(UserData);
    expect(result.current.userInfo).toEqual(UserData);

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(result.current.userInfo).toBeNull();
  });
});

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle setting and clearing user information", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUserInfo(UserData);
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual(UserData);
    expect(result.current.userInfo).toEqual(UserData);

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(result.current.userInfo).toBeNull();
  });
});

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle setting and clearing user information", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUserInfo(UserData);
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual(UserData);
    expect(result.current.userInfo).toEqual(UserData);

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(result.current.userInfo).toBeNull();
  });
});

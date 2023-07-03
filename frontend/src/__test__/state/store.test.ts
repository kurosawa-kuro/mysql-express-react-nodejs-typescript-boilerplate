// frontend\src\__test__\state\store.test.ts
// frontend\src\__test__\state\store.test.ts
// frontend\src\__test__\state\store.test.ts
import { renderHook, act } from "@testing-library/react-hooks";

import { useAuthStore } from "../../state/store";

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
      result.current.setUserInfo({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "testToken",
      });
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });
    expect(result.current.userInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });

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
      result.current.setUserInfo({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "testToken",
      });
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });
    expect(result.current.userInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });

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
      result.current.setUserInfo({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "testToken",
      });
    });

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    expect(storedUserInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });
    expect(result.current.userInfo).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "testToken",
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(result.current.userInfo).toBeNull();
  });
});

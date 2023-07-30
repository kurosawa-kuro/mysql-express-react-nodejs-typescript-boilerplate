// frontend\src\main.tsx

// External Imports
// import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Internal Imports
import { App } from "./App.tsx";
import "./index.css";
import { LoginScreen } from "./screens/auth/LoginScreen.tsx";
import { RegisterScreen } from "./screens/auth/RegisterScreen.tsx";
import { HomeScreen } from "./screens/HomeScreen.tsx";
import { InformationScreen } from "./screens/InformationScreen.tsx";

import { ProfileScreen } from "./screens/user/ProfileScreen";
import { UserListScreen } from "./screens/user/UserListScreen.tsx";
// import { UserEditScreen } from "./screens/admin/user/UserEditScreen";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import { AdminRoute } from "./components/routing/AdminRoute";
import { UserScreen } from "./screens/user/UserScreen.tsx";
import { UserEditScreen } from "./screens/admin/user/UserEditScreen.tsx";
import { PostNewScreen } from "./screens/post/PostNewScreen.tsx";
import { PostListScreen } from "./screens/post/PostListScreen.tsx";
import { PostScreen } from "./screens/post/PostScreen.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/information" element={<InformationScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/users" element={<UserListScreen />} />
        <Route path="/users/:id/edit" element={<UserEditScreen />} />
        <Route path="/users/:id" element={<UserScreen />} />
        <Route path="/posts/new" element={<PostNewScreen />} />
        <Route path="/posts/my-posts" element={<PostListScreen />} />
        <Route path="/posts/:id" element={<PostScreen />} />
        <Route path="/posts/" element={<PostListScreen />} />
      </Route>

      <Route path="/" element={<AdminRoute />}>
        <Route path="/admin/users" element={<UserListScreen />} />
        <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

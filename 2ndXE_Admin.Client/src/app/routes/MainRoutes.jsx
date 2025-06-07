import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "../layouts/PageNotFound";
import Layout from "../layouts/Layout";
import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import Header from "../layouts/Header";
import Posts from "../pages/Posts";
import Settings from "../pages/Settings";
import PostDetail from "../pages/PostDetail";
import PostPayment from "../pages/PostPayment";
import Report from "../pages/Report";
import Login from "../pages/Login";
import UserProtect from "./UserProtect";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <UserProtect>
              <Layout />
            </UserProtect>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="posts" element={<Posts />} />
          <Route path="post-payment" element={<PostPayment />} />
          <Route path="reports" element={<Report />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

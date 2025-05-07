import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "../layouts/PageNotFound";
import Layout from "../layouts/Layout";
import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import Header from "../layouts/Header";
import Posts from "../pages/Posts";
import Approval from "../pages/Approval";
import Settings from "../pages/Settings";
import PostDetail from "../pages/PostDetail";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Header />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="accounts" element={<Accounts/>}/>
            <Route path="posts" element={<Posts />} />
            <Route path="approval" element={<Approval />} />
            <Route path="settings" element={<Settings />} />
            <Route path="posts/:id" element={<PostDetail />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

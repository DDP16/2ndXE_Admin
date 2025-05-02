import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "../layouts/PageNotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import Layout from "../layouts/Layout";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { LOCAL_EMAIL } from "../../settings/localVar";
import { Navigate } from "react-router-dom";

// Higher Order Component : HOC
// Magic Number
export default function UserProtect({ children }) {
  if (!localStorage.getItem(LOCAL_EMAIL)) {
    return (
      <>
        <Navigate to={"/login"} />
      </>
    );
  }
  return <>{children}</>;
}

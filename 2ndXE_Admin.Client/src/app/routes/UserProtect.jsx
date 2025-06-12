import { LOCAL_EMAIL, LOCAL_PASSWORD_HASH } from "../../settings/localVar";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";

export default function UserProtect({ children }) {
  // Check if user is authenticated by verifying email and password hash
  if (!isAuthenticated()) {
    return (
      <>
        <Navigate to={"/login"} />
      </>
    );
  }
  return <>{children}</>;
}

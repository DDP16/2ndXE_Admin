import { LOCAL_EMAIL, LOCAL_PASSWORD_HASH } from "../../settings/localVar";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import { logout } from "../pages/Login/services/logout";
import { useDispatch } from "react-redux";

export default function UserProtect({ children }) {
  const dispatch = useDispatch();

  // Check if user is authenticated by verifying email and password hash
  if (!isAuthenticated()) {
    return <Navigate to={"/login"} />;
  }

  // Check if user has admin role
  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      if (!user || user.role !== 'admin') {
        // Log out non-admin users who somehow authenticated
        dispatch(logout());
        return <Navigate to={"/login"} />;
      }
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    // If there's an error, log the user out to be safe
    dispatch(logout());
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
}

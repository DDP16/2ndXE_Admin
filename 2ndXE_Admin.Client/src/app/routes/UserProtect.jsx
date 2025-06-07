import { LOCAL_EMAIL } from "../../settings/localVar";
import { Navigate } from "react-router-dom";

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

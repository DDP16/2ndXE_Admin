import { LOCAL_EMAIL } from "../../../../settings/localVar";
import { post } from "../../../modules/lib/httpHandle";
import { sLogin } from "../loginStore";

export const loginEmail = (email, nav) => {
  let reqData = { email };

  post(
    "login/index.php",
    reqData,
    () => {
      // success
      localStorage.setItem(LOCAL_EMAIL, email);
      nav("/");
    },
    () => {
      //fail
      alert("User not found!");
      sLogin.set(false);
    }
  );
};

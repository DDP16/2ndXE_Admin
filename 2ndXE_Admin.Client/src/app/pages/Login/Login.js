import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sLogin } from "./loginStore";
import Loading from "./partials/Loading";
import { loginEmail } from "./services/loginUserByEmail";

// carla.myers@example.com
// Container Component - Logic
// Presentaton Component - Hien Thi
// SHIFT + ALT + O -> SHIFT + ALT + F -> CTRL + S
export default function Login() {
  const isLoading = sLogin.use();
  const ipRef = useRef();
  const nav = useNavigate();

  const handleClick = () => {
    sLogin.set(true);
    loginEmail(ipRef.current.value, nav);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <input ref={ipRef} />
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LOCAL_EMAIL } from "../../../settings/localVar";
import { signInWithEmail } from "./services/signInWithEmail";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(LOCAL_EMAIL)) {
      navigate("/");
    }
  }, []);

  const from = location.state?.from?.pathname || "/app/home";

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      console.log("Submitting login with:", email, password);

      const result = await dispatch(
        signInWithEmail({ email, password })
      ).unwrap();
      console.log("Login successful:", result);

      // Navigate to the desired page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error || "Login failed. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEnterPress = (e) => {
    if(e.key === 'Enter'){
      handleSubmit(e);
    }
  }

  return (
    <div className="w-full h-screen">
      <div className="flex flex-row p-0 m-0 border-0 rounded-0 h-screen w-screen">
        {/* Background section */}
        <div className="w-[70%] relative max-md:hidden">
          <img
            src="/src/app/assets/bg-car.jpg"
            className="w-full h-full object-cover"
            alt="Background"
          />
          <h2 className="absolute bottom-[28%] left-[2%] text-white text-2xl font-bold text-center z-10">
            About us
          </h2>
          <p className="absolute bottom-[5%] left-[2%] text-white text-lg font-bold text-justify z-10 max-w-[62vw]">
            At AutoTrade Exchange, we make buying and selling second-hand cars
            simple, safe, and hassle-free. Our platform connects car buyers and
            sellers with verified listings, smart search tools, and secure
            communication.
            <br />
            Whether you're upgrading your ride or looking for a great deal,
            we’re here to help every step of the way. Trusted by individuals and
            dealers alike, AutoTrade Exchange is your go-to marketplace for
            quality used cars.
          </p>
        </div>

        {/* Login form section */}
        <div className="w-[30%] bg-[#EEEEEE] rounded-lg p-12 flex flex-col items-center justify-center max-md:w-full">
          <div className="flex flex-col items-center">
            <img
              src="/src/app/assets/icon-carapp.png"
              className="min-w-[50px] w-[35%]"
              alt="Logo"
            />
            <h1 className="text-center text-primary text-2xl font-bold py-4">
              Đăng nhập
            </h1>
          </div>

          {error && (
            <div className="w-full bg-red-100 border rounded-lg border-red-400 text-red-700 px-4 py-3 relative mb-4">
              <span className="block sm:inline">
                Email or password is incorrect
              </span>
            </div>
          )}

          <div className="w-full mb-4 max-w-[400px]">
            <label
              htmlFor="email"
              className="block text-[#45474B] text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleEnterPress}
            />
          </div>

          <div className="w-full mb-4 max-w-[400px]">
            <label
              htmlFor="password"
              className="block text-[#45474B] text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleEnterPress}
            />
          </div>

          <div className="self-start flex items-center mb-4">
            <input
              type="checkbox"
              id="show-password"
              className="w-4 h-4 rounded accent-primary"
              onChange={handleClickShowPassword}
            />
            <label
              htmlFor="show-password"
              className="ml-2 block text-sm text-[#45474B]"
            >
              Hiện mật khẩu
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-2xl  hover:scale-102 hover:shadow-lg hover:shadow-gray-400 active:scale-90 transition-all duration-300 font-medium text-base"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

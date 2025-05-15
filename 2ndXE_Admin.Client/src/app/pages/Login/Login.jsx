import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/app/home';

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (e) => {
        navigate("/");
        // e.preventDefault();

        // if (!userName || !password) {
        //     setError('Vui lòng nhập đầy đủ thông tin');
        //     setTimeout(() => setError(''), 5000);
        //     return;
        // }

        // try {
        //     const response = await ApiService.loginUser({ userName, password });

        //     // Kiểm tra xem response có chứa jwt và role không
        //     if (response.jwt) {
        //         localStorage.setItem('jwt', response.jwt);  // Lưu jwt vào localStorage
        //         localStorage.setItem('role', response.role);  // Lưu role vào localStorage
        //         navigate(from, { replace: true });  // Chuyển hướng về trang trước đó
        //     } else {
        //         throw new Error('Token không có trong phản hồi');
        //     }
        // } catch (error) {
        //     // Đảm bảo thông báo lỗi chi tiết từ API
        //     setError(error.response?.data?.message || error.message);
        //     setTimeout(() => setError(''), 5000);
        // }
    };

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
                        At AutoTrade Exchange, we make buying and selling second-hand cars simple, safe, and hassle-free. Our platform connects car buyers and sellers with verified listings, smart search tools, and secure communication. 
                        <br/>Whether you're upgrading your ride or looking for a great deal, we’re here to help every step of the way. Trusted by individuals and dealers alike, AutoTrade Exchange is your go-to marketplace for quality used cars.
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
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                        <div className="w-full mb-4 max-w-[400px]">
                            <label htmlFor="username" className="block text-[#45474B] text-sm font-medium mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        
                        <div className="w-full mb-4 max-w-[400px]">
                            <label htmlFor="password" className="block text-[#45474B] text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <div className="self-start flex items-center mb-4">
                            <input 
                                type="checkbox"
                                id="show-password"
                                className="w-4 h-4 rounded accent-primary"
                                onChange={handleClickShowPassword}
                            />
                            <label htmlFor="show-password" className="ml-2 block text-sm text-[#45474B]">
                                Hiện mật khẩu
                            </label>
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-2xl  hover:scale-102 hover:shadow-lg hover:shadow-gray-400 active:scale-90 transition-all duration-300 font-medium text-base"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
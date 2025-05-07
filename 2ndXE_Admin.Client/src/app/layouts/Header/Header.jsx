import React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const Header = ({
  username = "Ahmed",
  userRole = "Admin",
  avatar = "https://robohash.org/04adc2533b0e126d2971e205a7e2c611?set=set4&bgset=&size=400x400",
}) => {
  return (
    <div className="flex flex-col h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-linear-to-r from-primary-400 to-white to-30% px-6 py-4 flex justify-between items-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-medium"
        >
          {/* Good morning {username} */}
          Good Morning
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <div className="text-sm font-medium">Moni Roy</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <button>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </motion.header>

      <div className="flex-1 inset-shadow-sm inset-shadow-gray-500">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;

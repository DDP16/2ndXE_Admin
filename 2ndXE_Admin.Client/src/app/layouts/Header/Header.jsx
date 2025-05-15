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
        className="bg-linear-to-r from-primary-400 to-white to-30% px-6 py-2 flex justify-between items-center"
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

        <div className="flex items-center gap-1">
          <div className="text-right mr-2">
            <div className="text-sm font-medium">Moni Roy</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </motion.header>

      <div className="flex-1 inset-shadow-sm inset-shadow-gray-500">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  FileText,
  Settings,
  LogOut,
  CheckCheck,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, path, isActive = false }) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="animate-fade-in"
    >
      <NavLink
        to={path}
        className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "text-primary border-r-4 border-primary"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        {Icon}
        <span className="mt-1 text-xs">{label}</span>
      </NavLink>
    </motion.div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: <LayoutGrid className="w-5 h-5" />, path: "/" },
    {
      label: "Accounts",
      icon: <Users className="w-5 h-5" />,
      path: "/accounts",
    },
    { label: "Posts", icon: <FileText className="w-5 h-5" />, path: "/posts" },
    {
      label: "Approval",
      icon: <CheckCheck className="w-5 h-5" />,
      path: "/approval",
    },
  ];

  const bottomMenuItems = [
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
    { label: "Logout", icon: <LogOut className="w-5 h-5" />, path: "/logout" },
  ];

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[140px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between"
    >
      <div>
        <Link to="/">
          <div className="py-5 text-xl font-bold text-primary text-center">
            2ndXE
          </div>
        </Link>
      </div>

      <div>
        <nav className="flex-1 py-5">
          <div className="flex flex-col space-y-3 h-full">
            {menuItems.map((item) => (
              <div key={item.path} className="px-4">
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={location.pathname === item.path}
                />
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="py-5 space-y-3">
        <nav className="flex-1">
          <div className="px-4">
            <SidebarItem
              key={bottomMenuItems[0].path}
              icon={bottomMenuItems[0].icon}
              label={bottomMenuItems[0].label}
              path={bottomMenuItems[0].path}
              isActive={location.pathname === bottomMenuItems[0].path}
            />
          </div>
        </nav>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="animate-fade-in px-4"
        >
          <div
            onClick={() => {
              setShowModal(true);
            }}
            // Add your logout logic here. For example, you might want to clear user data and redirect to login page
            // or use a logout function from your auth context or service. For now, we'll just log to the console
            // and you can replace this with your actual logout logic.
            className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:cursor-pointer`}
          >
            {bottomMenuItems[1].icon}
            <span className="mt-1 text-xs">{bottomMenuItems[1].label}</span>
          </div>
        </motion.div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-10 transition-all duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Logout Confirmation</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:scale-105 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {navigate("/login")}}
                className="px-4 py-2 bg-primary text-white rounded hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;

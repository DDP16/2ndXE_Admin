import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ 
  username = 'Ahmed', 
  userRole = 'Admin', 
  avatar = '/lovable-uploads/33d608ef-cb5c-4562-93ae-b526c45ab1b3.png' 
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-orange-100 px-6 py-4 flex justify-between items-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-medium"
      >
        Good morning {username}
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
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
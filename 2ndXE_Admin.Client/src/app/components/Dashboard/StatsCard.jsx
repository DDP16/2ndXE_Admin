import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, User, FileText, LineChart } from 'lucide-react';

// Removed TypeScript interface and types

const StatsCard = ({ title, value, change, isUp, fromText, type }) => {
  const iconMap = {
    user: <User className="w-6 h-6 text-purple-600" />,
    post: <FileText className="w-6 h-6 text-amber-500" />,
    profit: <LineChart className="w-6 h-6 text-green-500" />
  };

  const bgColorMap = {
    user: 'bg-purple-100',
    post: 'bg-amber-100',
    profit: 'bg-green-100'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-5 shadow-sm"
    >
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-bold mb-2">{value}</div>
          <div className={`flex items-center text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{change} {isUp ? 'Up' : 'Down'} from {fromText}</span>
          </div>
        </div>
        <div className={`${bgColorMap[type]} p-3 rounded-full`}>
          {iconMap[type]}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
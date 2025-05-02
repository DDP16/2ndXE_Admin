import React from 'react';
import { motion } from 'framer-motion';
import ProfitChart from '../../components/Dashboard/ProfitChart';
import StatsCard from '../../components/Dashboard/StatsCard';
import Header from '../../layouts/Header';

const Dashboard = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen">
      <Header />
      <div className="p-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-6"
        >
          Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total User" 
            value="40,689" 
            change="8.5%" 
            isUp={true} 
            fromText="yesterday" 
            type="user"
          />
          <StatsCard 
            title="Total Post" 
            value="10293" 
            change="1.3%" 
            isUp={true} 
            fromText="past week" 
            type="post"
          />
          <StatsCard 
            title="Total Profit" 
            value="$89,000" 
            change="4.3%" 
            isUp={false} 
            fromText="yesterday" 
            type="profit"
          />
        </div>
        
        <ProfitChart />
      </div>
    </div>
  );
};

export default Dashboard;
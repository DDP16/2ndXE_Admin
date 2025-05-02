import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: '5', value: 20 },
  { name: '10', value: 30 },
  { name: '15', value: 45 },
  { name: '20', value: 35 },
  { name: '25', value: 47 },
  { name: '30', value: 60 },
  { name: '35', value: 100 },
  { name: '40', value: 40 },
  { name: '45', value: 45 },
  { name: '50', value: 70 },
  { name: '55', value: 65 },
  { name: '60', value: 75 },
];

const ProfitChart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg p-5 shadow-sm mt-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profit Details</h2>
        <div className="relative">
          <select className="appearance-none bg-gray-100 px-4 py-1 pr-8 rounded-md text-gray-600 text-sm border border-gray-200">
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7730" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FF7730" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`$${value * 1000}`, 'Value']}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #FF7730',
                borderRadius: '4px',
                padding: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#FF7730" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 4, fill: "#FF7730" }}
              activeDot={{ r: 6, fill: "#FF7730" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProfitChart;
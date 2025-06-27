import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Alert } from "antd";
import ProfitChart from "../../components/Dashboard/ProfitChart";
import StatsCard from "../../components/Dashboard/StatsCard";
import Header from "../../layouts/Header";
import { fetchDashboardData } from "../../modules/services/Dashboard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    userCount, 
    postCount, 
    totalProfit, 
    chartData, 
    loading, 
    error, 
    lastUpdated 
  } = useSelector((state) => state.dashboard);

  // Format số với dấu phẩy ngăn cách hàng nghìn
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return formatNumber(amount) + " VND";
  };

  // Tính phần trăm thay đổi (ví dụ: giả lập)
  const getChangePercentage = () => {
    return (Math.random() * 10 - 3).toFixed(1);
  };

  useEffect(() => {
    // Lấy dữ liệu Dashboard khi component mount
    dispatch(fetchDashboardData());

    // Tự động cập nhật dữ liệu mỗi 5 phút
    const refreshInterval = setInterval(() => {
      dispatch(fetchDashboardData());
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="flex-1 p-6">
        <Alert
          message="Error Loading Dashboard"
          description={error || "Failed to load dashboard data"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-2">
      <div className="p-4 overflow-y-auto max-h-[98vh]">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Dashboard
          </motion.h1>
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>

        {loading && !userCount && !postCount && !totalProfit ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading dashboard data..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Users"
                value={formatNumber(userCount || 0)}
                change={getChangePercentage() + "%"}
                isUp={parseFloat(getChangePercentage()) > 0}
                fromText="yesterday"
                type="user"
              />
              <StatsCard
                title="Total Posts"
                value={formatNumber(postCount || 0)}
                change={getChangePercentage() + "%"}
                isUp={parseFloat(getChangePercentage()) > 0}
                fromText="past week"
                type="post"
              />
              <StatsCard
                title="Total Profit"
                value={formatCurrency(totalProfit || 0)}
                change={getChangePercentage() + "VND"}
                isUp={parseFloat(getChangePercentage()) > 0}
                fromText="yesterday"
                type="profit"
              />
            </div>

            <div className="mt-6">
              <ProfitChart data={chartData} loading={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

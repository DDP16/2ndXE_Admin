import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { message, Spin } from "antd";
import { fetchAllPostPayment, updatePostPayment, deletePostPayment } from "../../modules/services/PostPayment";

// Mock data for testing before API implementation
const mockPostPaymentData = [
  {
    id: 1,
    post_id: "POST001",
    user_id: "USER001",
    display_duration: 30,
    total_price: 45.99,
    status: "paid",
    created_at: "2025-01-15T10:30:00.000Z",
    updated_at: "2025-01-15T10:30:00.000Z",
  },
  {
    id: 2,
    post_id: "POST002",
    user_id: "USER002",
    display_duration: 15,
    total_price: 22.50,
    status: "pending",
    created_at: "2025-01-20T14:45:00.000Z",
    updated_at: "2025-01-20T14:45:00.000Z",
  },
  {
    id: 3,
    post_id: "POST003",
    user_id: "USER003",
    display_duration: 60,
    total_price: 89.99,
    status: "paid",
    created_at: "2025-02-01T09:15:00.000Z",
    updated_at: "2025-02-01T09:15:00.000Z",
  },
  {
    id: 4,
    post_id: "POST004",
    user_id: "USER001",
    display_duration: 7,
    total_price: 12.99,
    status: "failed",
    created_at: "2025-02-10T16:20:00.000Z",
    updated_at: "2025-02-10T16:20:00.000Z",
  },
  {
    id: 5,
    post_id: "POST005",
    user_id: "USER004",
    display_duration: 45,
    total_price: 67.50,
    status: "paid",
    created_at: "2025-02-15T11:00:00.000Z",
    updated_at: "2025-02-15T11:00:00.000Z",
  },
  {
    id: 6,
    post_id: "POST006",
    user_id: "USER005",
    display_duration: 30,
    total_price: 45.99,
    status: "pending",
    created_at: "2025-03-01T13:30:00.000Z",
    updated_at: "2025-03-01T13:30:00.000Z",
  },
  {
    id: 7,
    post_id: "POST007",
    user_id: "USER002",
    display_duration: 90,
    total_price: 134.99,
    status: "paid",
    created_at: "2025-03-05T08:45:00.000Z",
    updated_at: "2025-03-05T08:45:00.000Z",
  },
  {
    id: 8,
    post_id: "POST008",
    user_id: "USER006",
    display_duration: 21,
    total_price: 31.50,
    status: "failed",
    created_at: "2025-03-10T15:15:00.000Z",
    updated_at: "2025-03-10T15:15:00.000Z",
  },
];

// Function to format date from ISO string to DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return "-";
  }
};

const PaymentStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

export default function PostPayment() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  
  const dispatch = useDispatch();
  const { postPayments, loading, error } = useSelector((state) => state.postPayment);

  // Use mock data for now, replace with real data when API is ready
  const [useRealData, setUseRealData] = useState(true);
  const dataSource = useRealData ? postPayments : mockPostPaymentData;

  const fetchPostPayments = async () => {
    if (!useRealData) {
      console.log("Using mock data for PostPayment");
      return;
    }
    
    try {
      await dispatch(fetchAllPostPayment()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch post payments: " + (err.message || "Unknown error")
      );
      // Fallback to mock data if API fails
      setUseRealData(false);
    }
  };

  const handleEditPostPayment = async (paymentId, updatedData) => {
    if (!useRealData) {
      message.info("Edit functionality will be available with real API");
      return;
    }
    
    try {
      await dispatch(updatePostPayment({ id: paymentId, updatedData })).unwrap();
      message.success("Post payment updated successfully!");
      await fetchPostPayments();
    } catch (err) {
      message.error(
        "Failed to update post payment: " + (err.message || "Unknown error")
      );
    }
  };

  const handleDeletePostPayment = async (paymentId) => {
    if (!useRealData) {
      message.info("Delete functionality will be available with real API");
      return;
    }
    
    try {
      await dispatch(deletePostPayment(paymentId)).unwrap();
      message.success("Post payment deleted successfully!");
      await fetchPostPayments();
    } catch (err) {
      message.error(
        "Failed to delete post payment: " + (err.message || "Unknown error")
      );
    }
  };

  useEffect(() => {
    fetchPostPayments();
  }, [dispatch, useRealData]);

  // Log whenever postPayments changes
  useEffect(() => {
    console.log("Post payments state updated:", dataSource);
  }, [dataSource]);

  // Filter the data based on search and status filter
  const filterPostPaymentData = dataSource && dataSource.length > 0
    ? dataSource.filter((row) =>
        (row.post_id && row.post_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
         row.user_id && row.user_id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterStatus !== "" ? row.status === filterStatus : true)
      )
    : [];

  const totalItems = filterPostPaymentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedPayments.length === dataSource.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(dataSource.map((payment) => payment.id));
    }
  };

  const toggleSelectPayment = (paymentId) => {
    if (selectedPayments.includes(paymentId)) {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    } else {
      setSelectedPayments([...selectedPayments, paymentId]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Post Payments</h1>
        
        {/* Toggle between mock and real data */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Use Real Data:</span>
          <button
            onClick={() => setUseRealData(!useRealData)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${
              useRealData ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition ${
                useRealData ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between">
        <div
          className={`relative ${
            searchQuery.length > 0 ? "w-64" : "w-50"
          } focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
            placeholder="Search by Post ID or User ID"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center py-2">
            <Filter size={18} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          <div className="relative w-32">
            <select
              title="status filter"
              className="w-full bg-white hover:shadow-lg active:bg-gray-50 border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none transition-all duration-100"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
              }}
            >
              <option value="" className="italic">
                Status
              </option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <ChevronDown
              size={16}
              className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none"
            />
          </div>

          <button
            className="flex items-center py-2 text-red-500 font-medium text-sm active:scale-95 transition-all duration-100"
            onClick={() => {
              setFilterStatus("");
            }}
          >
            <span className="cursor-pointer">Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-[88vw]">
        {(loading && useRealData) ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading post payments..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="ps-4 py-3 text-left">
                    <div className="flex items-center">
                      <span className="ml-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Post ID
                      </span>
                      <ChevronDown size={16} className="ml-3 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Duration (Days)
                      <ChevronDown
                        size={16}
                        className="inline ml-1 text-gray-400"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Total Price (VND)
                      <ChevronDown
                        size={16}
                        className="inline ml-3 text-gray-400"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Status
                      <ChevronDown
                        size={16}
                        className="inline ml-3 text-gray-400"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Created
                      <ChevronDown
                        size={16}
                        className="inline ml-3 text-gray-400"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex justify-center">Action</div>
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white divide-y divide-gray-200"
              >
                {filterPostPaymentData
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 h-[7.5vh]"
                    >
                      <td className="ps-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.post_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {payment.user_id}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center">
                        {payment.display_duration} days
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center font-medium">
                        {payment.total_price.toFixed(0)} VND
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-center">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex space-x-2 justify-center">
                          <button 
                            className="text-gray-400 hover:text-gray-600 active:scale-70 transition-all duration-100"
                            onClick={() => handleEditPostPayment(payment.id, {})}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-gray-600 active:scale-70 transition-all duration-100"
                            onClick={() => handleDeletePostPayment(payment.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                {/* Empty rows to maintain consistent table height */}
                {Array.from({
                  length:
                    itemsPerPage -
                    Math.min(
                      itemsPerPage,
                      totalItems - currentPage * itemsPerPage
                    ),
                }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[7.5vh]">
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
                  </tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-500">
            Showing {currentPage * itemsPerPage + 1}-
            {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of{" "}
            {totalItems}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage + 1 === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

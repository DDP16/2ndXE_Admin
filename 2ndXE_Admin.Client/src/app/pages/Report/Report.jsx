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
import {
  fetchAllReport,
  updateReport,
  deleteReport,
} from "../../modules/services/Report";

// Mock data for testing before API implementation
const mockReportData = [
  {
    id: 1,
    user_id: "USER001",
    post_id: "POST001",
    reason: "Inappropriate content",
    status: "pending",
    created_at: "2025-01-15T10:30:00.000Z",
  },
  {
    id: 2,
    user_id: "USER002",
    post_id: "POST002",
    reason: "Spam or fake listing",
    status: "resolved",
    created_at: "2025-01-20T14:45:00.000Z",
  },
  {
    id: 3,
    user_id: "USER003",
    post_id: "POST003",
    reason: "Misleading information",
    status: "rejected",
    created_at: "2025-02-01T09:15:00.000Z",
  },
  {
    id: 4,
    user_id: "USER004",
    post_id: "POST004",
    reason: "Duplicate posting",
    status: "pending",
    created_at: "2025-02-05T16:20:00.000Z",
  },
  {
    id: 5,
    user_id: "USER005",
    post_id: "POST005",
    reason: "Offensive language",
    status: "resolved",
    created_at: "2025-02-10T11:30:00.000Z",
  },
  {
    id: 6,
    user_id: "USER006",
    post_id: "POST006",
    reason: "Price manipulation",
    status: "pending",
    created_at: "2025-02-15T13:45:00.000Z",
  },
  {
    id: 7,
    user_id: "USER007",
    post_id: "POST007",
    reason: "Stolen vehicle listing",
    status: "resolved",
    created_at: "2025-02-20T08:20:00.000Z",
  },
  {
    id: 8,
    user_id: "USER008",
    post_id: "POST008",
    reason: "False contact information",
    status: "rejected",
    created_at: "2025-02-25T15:10:00.000Z",
  },
  {
    id: 9,
    user_id: "USER009",
    post_id: "POST009",
    reason: "Inappropriate images",
    status: "pending",
    created_at: "2025-03-01T12:00:00.000Z",
  },
  {
    id: 10,
    user_id: "USER010",
    post_id: "POST010",
    reason: "Harassment in comments",
    status: "resolved",
    created_at: "2025-03-05T17:30:00.000Z",
  },
];

// Function to format date from ISO string to DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return "-";
  }
};

const ReportStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
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

export default function Reports() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.report);

  // Use mock data for now, replace with real data when API is ready
  const [useRealData, setUseRealData] = useState(false);
  const dataSource = useRealData ? reports : mockReportData;

  const fetchReports = async () => {
    if (!useRealData) {
      console.log("Using mock data for Reports");
      return;
    }

    try {
      await dispatch(fetchAllReport()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch reports: " + (err.message || "Unknown error")
      );
      // Fallback to mock data if API fails
      setUseRealData(false);
    }
  };

  const handleEditReport = async (reportId, updatedData) => {
    if (!useRealData) {
      message.info("Edit functionality will be available with real API");
      return;
    }

    try {
      await dispatch(updateReport({ id: reportId, updatedData })).unwrap();
      message.success("Report updated successfully!");
      await fetchReports();
    } catch (err) {
      message.error(
        "Failed to update report: " + (err.message || "Unknown error")
      );
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!useRealData) {
      message.info("Delete functionality will be available with real API");
      return;
    }

    try {
      await dispatch(deleteReport(reportId)).unwrap();
      message.success("Report deleted successfully!");
      await fetchReports();
    } catch (err) {
      message.error(
        "Failed to delete report: " + (err.message || "Unknown error")
      );
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dispatch, useRealData]);

  // Log whenever reports changes
  useEffect(() => {
    console.log("Reports state updated:", reports);
  }, [reports]);

  // Use the actual data from Redux state or mock data
  const filterReportsData =
    dataSource && dataSource.length > 0
      ? dataSource.filter((report) => {
          const matchesSearch =
            (report.user_id &&
              report.user_id
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (report.post_id &&
              report.post_id
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (report.reason &&
              report.reason.toLowerCase().includes(searchQuery.toLowerCase()));

          const matchesStatus =
            filterStatus === "" || report.status === filterStatus;

          return matchesSearch && matchesStatus;
        })
      : [];

  const totalItems = filterReportsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedReports = filterReportsData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleSelectAll = () => {
    if (
      selectedReports.length === paginatedReports.length &&
      paginatedReports.length > 0
    ) {
      setSelectedReports([]);
    } else {
      setSelectedReports(paginatedReports.map((report) => report.id));
    }
  };

  const toggleSelectReport = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter((id) => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <h1 className="text-2xl font-bold text-gray-800">Reports Management</h1>

        {/* Toggle between mock and real data */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Use Real Data:</span>
          <button
            onClick={() => setUseRealData(!useRealData)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${
              useRealData ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition ${
                useRealData ? "translate-x-6" : "translate-x-1"
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
            placeholder="Search by User ID, Post ID, or Reason"
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
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
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
        {loading && useRealData ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading reports..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="ps-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={
                          selectedReports.length === paginatedReports.length &&
                          paginatedReports.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                      <span className="ml-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User ID
                      </span>
                      <ChevronDown size={16} className="ml-3 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Post ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Reason
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
                      Created At
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
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReports.map((report) => (
                  <motion.tr
                    key={report.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50 transition-colors h-[7.5vh]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => toggleSelectReport(report.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {report.user_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.post_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={report.reason}
                      >
                        {report.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ReportStatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500">
                        {formatDate(report.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => handleEditReport(report.id, {})}
                          title="Edit Report"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          onClick={() => handleDeleteReport(report.id)}
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {/* Empty rows to maintain consistent table height */}
                {Array.from({
                  length:
                    itemsPerPage -
                    Math.min(itemsPerPage, paginatedReports.length),
                }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[7.5vh]">
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filterReportsData.length)} of{" "}
              {filterReportsData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

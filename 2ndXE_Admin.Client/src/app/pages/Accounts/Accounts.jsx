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
  fetchAllAccount,
  updateAccount,
  deleteAccount,
} from "../../modules/services/Account";
import Header from "../../layouts/Header";

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
    console.error("Error formatting date:", error);
    return "-";
  }
};

const AccountVerifiedBadge = ({ verified }) => {
  const getVerifiedStyles = () => {
    switch (verified) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getVerifiedStyles()}`}
    >
      {verified.toString().charAt(0).toUpperCase() +
        verified.toString().slice(1)}
    </span>
  );
};

const AccountAvatar = ({ name, avatarUrl }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium">
          {initials}
        </div>
      )}
    </div>
  );
};

export default function Accounts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterVerified, setFilterVerified] = useState("");

  const dispatch = useDispatch();
  const { accounts, loading, error } = useSelector((state) => state.account);

  const fetchAccounts = async () => {
    try {
      await dispatch(fetchAllAccount()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch accounts: " + (err.message || "Unknown error")
      );
    }
  };

  const handleEditAccount = async (accountId, updatedData) => {
    try {
      await dispatch(updateAccount({ id: accountId, updatedData })).unwrap();
      message.success("Account updated successfully!");
      await fetchAccounts();
    } catch (err) {
      message.error(
        "Failed to update account: " + (err.message || "Unknown error")
      );
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await dispatch(deleteAccount(accountId)).unwrap();
      message.success("Account deleted successfully!");
      await fetchAccounts();
    } catch (err) {
      message.error(
        "Failed to delete account: " + (err.message || "Unknown error")
      );
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [dispatch]);

  // Log whenever accounts changes
  useEffect(() => {
    console.log("Accounts state updated:", accounts);
  }, [accounts]);

  // Use the actual data from Supabase instead of the mock data
  const filterAccountsData =
    accounts && accounts.length > 0
      ? accounts.filter(
          (row) =>
            row.full_name &&
            row.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterRole !== "" ? row.role === filterRole : true) &&
            (filterVerified !== ""
              ? row.verified?.toString() === filterVerified
              : true)
        )
      : [];

  const totalItems = filterAccountsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const toggleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map((account) => account.id));
    }
  };

  const toggleSelectAccount = (accountId) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter((id) => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
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
      <h1 className="text-2xl font-bold text-gray-800">Accounts</h1>{" "}
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
            placeholder="Search account"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log(searchQuery);
            }}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center py-2">
            <Filter size={18} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>
          <div className="relative w-25">
            <select
              title="status filter"
              className="w-full bg-white hover:shadow-lg active:bg-gray-50 border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none transition-all duration-100"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
              }}
            >
              <option value="" className="italic">
                Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <ChevronDown
              size={16}
              className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none"
            />
          </div>
          <div className="relative w-25">
            <select
              title="status filter"
              className="w-full bg-white hover:shadow-lg active:bg-gray-50 border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none transition-all duration-100"
              value={filterVerified}
              onChange={(e) => {
                setFilterVerified(e.target.value);
              }}
            >
              <option value="" className="italic">
                Verified
              </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <ChevronDown
              size={16}
              className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none"
            />
          </div>{" "}
          <button
            className="flex items-center py-2 text-red-500 font-medium text-sm active:scale-95 transition-all duration-100"
            onClick={() => {
              setFilterRole("");
              setFilterVerified("");
            }}
          >
            <span className="cursor-pointer">Reset Filter</span>
          </button>
        </div>
      </div>
      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading accounts..." />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-[88vw]">
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="ps-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedAccounts.length === accounts.length}
                        onChange={toggleSelectAll}
                      />
                      <span className="ml-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full Name
                      </span>
                      <ChevronDown size={16} className="ml-3 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      Role
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
                      Verified
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
                    <div className="flex items-center justify-center">
                      Updated
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
                {filterAccountsData
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((account, index) => (
                    <motion.tr
                      key={account.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 h-[7.5vh]"
                    >
                      <td className="ps-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedAccounts.includes(account.id)}
                            onChange={() => toggleSelectAccount(account.id)}
                          />
                          <div className="ml-4 flex items-center">
                            <AccountAvatar name={account.full_name} avatarUrl={account.avatar_url} />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {account.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {account.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {account.phone}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center">
                        {account.role}
                      </td>{" "}
                      <td className="px-6 py-2 whitespace-nowrap text-center">
                        <AccountVerifiedBadge verified={account.is_verified} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                        {formatDate(account.created_at)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                        {formatDate(account.updated_at)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex space-x-2 justify-center">
                          <button className="text-gray-400 hover:text-gray-600 active:scale-70 transition-all duration-100">
                            <Pencil size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 active:scale-70 transition-all duration-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

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
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                  </tr>
                ))}
              </motion.tbody>
            </table>
          </div>

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
                disabled={currentPage + 1 === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

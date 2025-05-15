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
import Header from "../../layouts/Header";

const accountsData = [
  {
    id: 1,
    name: "John Bushmill",
    email: "John@gmail.com",
    phone: "078 5054 8877",
    role: "Admin",
    verified: true,
    created: "29 Dec 2022",
    updated: "01 Jan 2023",
  },
  {
    id: 2,
    name: "Laura Prichet",
    email: "laura_prichet@gmail.com",
    phone: "215 302 3376",
    role: "User",
    verified: false,
    created: "24 Dec 2022",
    updated: "26 Dec 2022",
  },
  {
    id: 3,
    name: "Mohammad Karim",
    email: "m_karim@gmail.com",
    phone: "050 414 8778",
    role: "User",
    verified: true,
    created: "12 Dec 2022",
    updated: "15 Dec 2022",
  },
  {
    id: 4,
    name: "Josh Bill",
    email: "josh_bill@gmail.com",
    phone: "216 75 612 706",
    role: "User",
    verified: false,
    created: "21 Oct 2022",
    updated: "25 Oct 2022",
  },
  {
    id: 5,
    name: "Josh Adam",
    email: "josh_adam@gmail.com",
    phone: "02 75 150 655",
    role: "Admin",
    verified: true,
    created: "21 Oct 2022",
    updated: "23 Oct 2022",
  },
  {
    id: 6,
    name: "Sin Tae",
    email: "sin_tae@gmail.com",
    phone: "078 6013 3854",
    role: "User",
    verified: true,
    created: "21 Oct 2022",
    updated: "22 Oct 2022",
  },
  {
    id: 7,
    name: "Rajesh Masvidal",
    email: "rajesh_m@gmail.com",
    phone: "828 216 2190",
    role: "User",
    verified: false,
    created: "19 Sep 2022",
    updated: "20 Sep 2022",
  },
  {
    id: 8,
    name: "Fajar Surya",
    email: "fsurya@gmail.com",
    phone: "078 7173 9261",
    role: "User",
    verified: true,
    created: "19 Sep 2022",
    updated: "21 Sep 2022",
  },
  {
    id: 9,
    name: "Lisa Greg",
    email: "lisa@gmail.com",
    phone: "077 6157 4248",
    role: "Admin",
    verified: true,
    created: "19 Sep 2022",
    updated: "20 Sep 2022",
  },
  {
    id: 10,
    name: "Linda Blair",
    email: "lindablair@gmail.com",
    phone: "050 414 8778",
    role: "User",
    verified: false,
    created: "10 Aug 2022",
    updated: "12 Aug 2022",
  },
];

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
      {verified.toString().charAt(0).toUpperCase() + verified.toString().slice(1)}
    </span>
  );
};

const AccountAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
      {initials}
    </div>
  );
};

export default function Accounts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterVerified, setFilterVerified] = useState("");

  const filterAccountsData = accountsData.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterRole != "" ? row.role === filterRole : true) &&
      (filterVerified != "" ? row.verified.toString() === filterVerified : true)
    // && ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
  );

  const totalItems = filterAccountsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedAccounts.length === accountsData.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accountsData.map((account) => account.id));
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
          </div>

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
                      checked={selectedAccounts.length === accountsData.length}
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
                          <AccountAvatar name={account.name} />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {account.name}
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
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-center">
                      <AccountVerifiedBadge verified={account.verified} />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {account.created}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {account.updated}
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

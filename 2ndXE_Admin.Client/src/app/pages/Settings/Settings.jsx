import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Shield, Info } from "lucide-react";

export default function Settings() {
  const [userProfile, setUserProfile] = useState({
    name: "Moni Roy",
    email: "moniroy@example.com",
    role: "Admin",
    avatar: "https://robohash.org/04adc2533b0e126d2971e205a7e2c611?set=set4&bgset=&size=400x400",
    bio: "Product Manager with 5+ years of experience in tech industry.",
    phone: "+1 (555) 123-4567",
    company: "2ndXE",
    location: "San Francisco, CA",
  });

  // Form state
  const [formData, setFormData] = useState({ ...userProfile });

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile({ ...formData });
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Settings</h1>

        {/* Custom Tabs */}
        <div className="w-full mb-2">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      activeTab === "profile"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      activeTab === "security"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
            >
              <Shield size={16} />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      activeTab === "about"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
            >
              <Info size={16} />
              <span>About</span>
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white rounded-lg border shadow-sm p-4 flex flex-col my-20">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Profile Picture</h3>
                <p className="text-sm text-gray-500">
                  Update your profile picture
                </p>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors w-full">
                  Upload New Picture
                </button>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg border shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="p-4 border-b">
                  <h3 className="text-xl font-semibold">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update your account information
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role
                      </label>
                      <input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                    onClick={() => setFormData({ ...userProfile })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === "security" && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Security Settings</h3>
              <p className="text-sm text-gray-500">
                Manage your account security
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                onClick={() => toast.success("Password updated successfully!")}
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* About Tab Content */}
        {activeTab === "about" && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">About 2ndXE</h3>
              <p className="text-sm text-gray-500">
                Application information and version
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Version</h3>
                <p className="text-sm text-gray-500">1.0.0</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Release Date</h3>
                <p className="text-sm text-gray-500">May 6, 2025</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">License</h3>
                <p className="text-sm text-gray-500">Proprietary</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Shield, Info } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { verifyUserPassword } from "../../utils/authUtils";
import { changeAccountPassword, updateAccount } from "../../modules/services/Account";

export default function Settings() {
  const dispatch = useDispatch();
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password loading state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userProfile, setUserProfile] = useState({
    full_name: "",
    email: "",
    role: "",
    avatar: "https://robohash.org/04adc2533b0e126d2971e205a7e2c611?set=set4&bgset=&size=400x400",
    phone: "",
  });

  const {user, isAuthenticated, error, state} = useSelector((state) => state.login);
  
  // Load user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUserProfile({
          full_name: parsedUserData.full_name || "",
          email: parsedUserData.email || "",
          role: parsedUserData.role || "",
          avatar: parsedUserData.avatar_url || "https://robohash.org/04adc2533b0e126d2971e205a7e2c611?set=set4&bgset=&size=400x400",
          phone: parsedUserData.phone || "",
        });
        
        // Set form data with user profile
        setFormData({
          full_name: parsedUserData.full_name || "",
          email: parsedUserData.email || "",
          role: parsedUserData.role || "",
          avatar: parsedUserData.avatar_url || "https://robohash.org/04adc2533b0e126d2971e205a7e2c611?set=set4&bgset=&size=400x400",
          phone: parsedUserData.phone || "",
        });
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      toast.error("Failed to load user data");
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({ ...userProfile });

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");
  // Form loading state
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Helper function to get user ID from various sources
  const getUserId = () => {
    try {
      // Try to get from localStorage user_data
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData && parsedData.id) {
          return parsedData.id;
        }
      }
      
      // Try to get from user in Redux store
      if (user && user.id) {
        return user.id;
      }
      
      // Try to get from localStorage userId directly
      const userId = localStorage.getItem("userId") || localStorage.getItem("LOCAL_USER_ID");
      if (userId) {
        return userId;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent changes to email and role
    if (name === 'email' || name === 'role') {
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    // Convert kebab-case IDs to camelCase state properties
    const fieldName = id === 'current-password' ? 'currentPassword' : 
                     id === 'new-password' ? 'newPassword' : 
                     id === 'confirm-password' ? 'confirmPassword' : id;
    
    setPasswordData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[fieldName]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user_data");
      if (!userData) {
        toast.error("User data not found");
        setIsUpdatingProfile(false);
        return;
      }
      
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;
      
      if (!userId) {
        toast.error("User ID not found");
        setIsUpdatingProfile(false);
        return;
      }
      
      // Create updated data object (excluding email and role)
      const updatedData = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: parsedUserData.email,
        role: parsedUserData.role,
      };
      
      // Dispatch update action
      const result = await dispatch(updateAccount({
        id: userId,
        updatedData: updatedData
      }));
      
      if (result.error) {
        toast.error("Failed to update profile: " + result.error.message);
      } else {
        // Update local state
        setUserProfile({ ...formData });
        
        // Update localStorage
        const updatedUserData = {
          ...parsedUserData,
          ...updatedData
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));
        
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    
    // Reset errors
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
      try {
      // Validate current password
      console.log('Attempting to verify password:', passwordData.currentPassword);
      const isCurrentPasswordValid = await verifyUserPassword(passwordData.currentPassword);
      console.log('Password verification result:', isCurrentPasswordValid);
      
      if (!isCurrentPasswordValid) {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
        setIsChangingPassword(false);
        return;
      }
      
      // Validate new password
      if (passwordData.newPassword.length < 8) {
        setPasswordErrors((prev) => ({
          ...prev,
          newPassword: "Password must be at least 8 characters long",
        }));
        setIsChangingPassword(false);
        return;
      }
      
      // Validate password confirmation
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        setIsChangingPassword(false);
        return;
      }
        // Update password in the backend
      const userId = getUserId();
      
      if (!userId) {
        toast.error("User ID not found. Cannot update password.");
        setIsChangingPassword(false);
        return;
      }
      
      const result = await dispatch(changeAccountPassword({
        id: userId,
        newPassword: passwordData.newPassword,
      }));
      
      if (result.error) {
        toast.error("Failed to update password: " + result.error.message);
      } else {
        toast.success("Password updated successfully!");
        // Clear form fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating password");
    } finally {
      setIsChangingPassword(false);
    }
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

        {/* Profile Tab Content 
        fullname email phone role*/}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh]">
            <div className="md:col-span-1 bg-white rounded-lg border shadow-sm p-4 flex flex-col ">
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
                        name="full_name"
                        value={formData.full_name}
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
                        name="email"                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
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
                </div>
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                    onClick={() => setFormData({ ...userProfile })}
                  >
                    Cancel
                  </button>                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
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
                <form onSubmit={handlePasswordUpdate} className="space-y-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>                    <input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>                    <input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
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

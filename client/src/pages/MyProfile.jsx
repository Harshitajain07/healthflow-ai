import { useEffect, useState } from "react";
import axios from "axios";

function MyProfile() {
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      console.log("Saved User:", savedUser);

      if (savedUser) {
        setUser(savedUser);
        setFullName(savedUser.fullName || "");
        setEmail(savedUser.email || "");
      }
    } catch (error) {
      console.error("Error reading user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user ID
  const getUserId = () => {
    if (user?.id) return user.id;
    if (user?._id) return user._id;

    return null;
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const userId = getUserId();

    if (!userId) {
      setMessage("User ID not found. Please login again.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/patients/${userId}`,
        {
          fullName,
          email,
        }
      );

      if (response.data.success) {
        setMessage("Profile updated successfully ✅");

        const updatedUser = response.data.patient;

        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }
    } catch (error) {
      console.error("Update Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");

    const userId = getUserId();

    if (!userId) {
      setPasswordMessage("User ID not found. Please login again.");
      return;
    }

    // Check new password and confirm password
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          userId,
          currentPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        setPasswordMessage(
          "Password changed successfully ✅"
        );

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Change Password Error:", error);

      setPasswordMessage(
        error.response?.data?.message ||
          "Unable to change password."
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Please login first
          </h2>

          <p className="text-gray-500 mt-2">
            User information was not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              My Profile
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your personal information
            </p>

          </div>

          {/* Personal Information */}
          <form onSubmit={handleUpdateProfile}>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Personal Information
            </h2>

            {/* Full Name */}
            <div className="mb-5">

              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Role */}
            <div className="mb-5">

              <label className="block text-gray-700 font-semibold mb-2">
                Role
              </label>

              <input
                type="text"
                value={user.role || "patient"}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-500"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Save Profile Changes
            </button>

          </form>

          {message && (
            <p className="text-center text-green-600 font-semibold mt-4">
              {message}
            </p>
          )}

        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              🔐 Change Password
            </h2>

            <p className="text-gray-500 mt-1">
              Update your account password
            </p>

          </div>

          <form onSubmit={handleChangePassword}>

            {/* Current Password */}
            <div className="mb-5">

              <label className="block text-gray-700 font-semibold mb-2">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* New Password */}
            <div className="mb-5">

              <label className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Confirm Password */}
            <div className="mb-6">

              <label className="block text-gray-700 font-semibold mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Change Password
            </button>

          </form>

          {passwordMessage && (
            <p className="text-center font-semibold mt-4 text-blue-600">
              {passwordMessage}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default MyProfile;
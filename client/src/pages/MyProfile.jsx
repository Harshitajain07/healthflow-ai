
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaArrowLeft,
  FaSave,
  FaKey,
  FaCheckCircle,
} from "react-icons/fa";

const API = "http://localhost:5000/api";

function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );
      const token = localStorage.getItem("token");

      if (!savedUser || !token) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(savedUser);
      setFullName(savedUser.fullName || "");
      setEmail(savedUser.email || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getUserId = () => user?.id || user?._id || null;

  // Authentication headers
  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Update profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage("");

    const userId = getUserId();

    if (!userId) {
      setMessageType("error");
      setMessage("User ID not found. Please log in again.");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setMessageType("error");
      setMessage("Please enter your name and email.");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await axios.put(
        `${API}/patients/${userId}`,
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
        },
        authConfig()
      );

      if (response.data.success) {
        const updatedUser = response.data.patient;

        setUser(updatedUser);
        setFullName(updatedUser.fullName || "");
        setEmail(updatedUser.email || "");

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setMessageType("success");
        setMessage("Your profile has been updated successfully.");
      } else {
        setMessageType("error");
        setMessage(
          response.data.message || "Unable to update profile."
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);

      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password using the authenticated user's JWT
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordMessageType("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessageType("error");
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessageType("error");
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessageType("error");
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessageType("error");
      setPasswordMessage("Your new password must be different.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await axios.put(
        `${API}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        authConfig()
      );

      if (response.data.success) {
        setPasswordMessageType("success");
        setPasswordMessage(
          "Your password has been changed successfully."
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessageType("error");
        setPasswordMessage(
          response.data.message || "Unable to change password."
        );
      }
    } catch (error) {
      console.error("Password change error:", error);

      setPasswordMessageType("error");
      setPasswordMessage(
        error.response?.data?.message ||
          "Unable to change your password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "U";

  const feedbackClass = (type) =>
    type === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            to="/patient"
            className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>

          <div className="font-bold text-xl text-slate-800">
            HealthFlow <span className="text-teal-600">AI</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
            Account Settings
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Profile summary */}
        <section className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-7 md:p-9 text-white shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-4xl font-bold">
              {initials}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.fullName || "HealthFlow User"}
              </h2>

              <p className="text-teal-50 mt-1">{user.email}</p>

              <span className="inline-block mt-3 px-4 py-1 rounded-full bg-white/20 text-sm font-semibold capitalize">
                {user.role || "patient"} Account
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal information */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl">
                <FaUserCircle />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Update your account details
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Role
                </label>

                <div className="relative">
                  <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={user.role || "patient"}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-500 capitalize cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition shadow-sm"
              >
                <FaSave />
                {savingProfile ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>

            {message && (
              <div
                className={`mt-5 border rounded-xl p-3 text-sm font-medium ${feedbackClass(messageType)}`}
              >
                {message}
              </div>
            )}
          </section>

          {/* Change password */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                <FaLock />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Change Password
                </h2>

                <p className="text-sm text-slate-500">
                  Keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition shadow-sm"
              >
                <FaKey />
                {savingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>

            {passwordMessage && (
              <div
                className={`mt-5 border rounded-xl p-3 text-sm font-medium ${feedbackClass(passwordMessageType)}`}
              >
                {passwordMessage}
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl p-4">
              <FaCheckCircle className="text-teal-700 mt-1 shrink-0" />

              <p className="text-sm text-teal-800">
                Use a strong password that you do not reuse on other websites.
              </p>
            </div>
          </section>
        </div>

        <footer className="text-center text-sm text-slate-400 mt-10">
          © {new Date().getFullYear()} HealthFlow AI · Your Healthcare Companion
        </footer>
      </main>
    </div>
  );
}

export default MyProfile;


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("patient");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Check fields
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending registration request...");

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }
      );

      console.log("Registration response:", response.data);

      alert(
        response.data.message || "User Registered Successfully ✅"
      );

      // Clear form
      setFullName("");
      setEmail("");
      setPassword("");

      // Go to login page
      navigate("/login");

    } catch (error) {
      console.error("========== REGISTRATION ERROR ==========");
      console.error(error);
      console.error("Server response:", error.response?.data);
      console.error("Status:", error.response?.status);
      console.error("========================================");

      if (error.response) {
        alert(
          error.response.data?.message ||
          `Registration failed. Server returned ${error.response.status}.`
        );
      } else if (error.request) {
        alert(
          "Cannot connect to the server. Please make sure your backend is running on http://localhost:5000."
        );
      } else {
        alert(error.message || "Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[450px]">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-blue-700">
          🏥 HealthFlow AI
        </h1>

        <h2 className="text-2xl font-semibold mt-8 text-center">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Register to continue
        </p>

        {/* Full Name */}
        <div className="mt-6">
          <label className="font-semibold">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 transition duration-300"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="font-semibold">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 transition duration-300"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="font-semibold">
            Password
          </label>

          <div className="flex">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-l-xl outline-none focus:border-blue-600 transition duration-300"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mt-2 px-4 border border-gray-300 rounded-r-xl bg-gray-100"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>
        </div>

        {/* Register Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className={`w-full mt-8 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
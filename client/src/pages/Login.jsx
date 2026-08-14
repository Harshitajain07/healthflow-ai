import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    // Save token
    localStorage.setItem("token", response.data.token);

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert(response.data.message);

    if (response.data.user.role === "patient") {
    navigate("/patient");
    } else if (response.data.user.role === "doctor") {
    navigate("/doctor");
    } else if (response.data.user.role === "admin") {
    navigate("/admin");
    }

  } catch (error) {
    alert(error.response?.data?.message || "Login Failed");
  }
};

  return (

    <div className="min-h-screen bg-blue-50 flex justify-center items-center">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[420px]">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          🏥 HealthFlow AI
        </h1>

        <h2 className="text-2xl font-semibold mt-8 text-center">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Login to continue
        </p>

        <div className="mt-8">

          <label className="font-semibold">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          />

        </div>

        <div className="mt-6">

          <label className="font-semibold">
            Password
          </label>

          <div className="flex">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-l-xl outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="mt-2 px-4 border rounded-r-xl bg-gray-100"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

        </div>

        <div className="mt-3 text-right">

          <button className="text-blue-600 hover:underline">
            Forgot Password?
          </button>

        </div>
        
        <button
          onClick={handleLogin}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
  Login
</button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
        <Link
        to="/register"
            className="text-blue-600 font-semibold hover:underline"
                >
            Register
        </Link>

       

        </p>

      </div>

    </div>

  );

}

export default Login;
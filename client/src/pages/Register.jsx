import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const handleRegister = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        fullName,
        email,
        password,
        role,
      }
    );

    alert(response.data.message);

    // Clear the form
    setFullName("");
    setEmail("");
    setPassword("");

  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[450px]">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          🏥 HealthFlow AI
        </h1>

        <h2 className="text-2xl font-semibold mt-8 text-center">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Register to continue
        </p>

        <div className="mt-6">
          <label className="font-semibold">Full Name</label>
          
          <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 transition duration-300"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold">Email</label>
  
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 transition duration-300"
            />
        </div>

        <div className="mt-4">
          <label className="font-semibold">Password</label>

          <div className="flex">
          
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-l-xl outline-none focus:border-blue-600 transition duration-300"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="mt-2 px-4 border rounded-r-xl bg-gray-100"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
  Create Account
</button>

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
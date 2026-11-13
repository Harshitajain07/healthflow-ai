
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: trimmedName,
          email: normalizedEmail,
          password,
        }
      );

      setSuccess(
        response.data.message || "Patient account created successfully!"
      );

      setFullName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request
            ? "Cannot connect to the server. Please check that your backend is running."
            : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-teal-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-xl sm:p-10">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
            🏥
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            HealthFlow <span className="text-teal-600">AI</span>
          </h1>

          <h2 className="mt-7 text-2xl font-bold text-slate-800">
            Create Patient Account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Join HealthFlow AI and manage your healthcare in one place.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={loading}
                className="absolute inset-y-0 right-3 my-auto text-sm font-semibold text-teal-700 hover:text-teal-900 disabled:opacity-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* Account Type Information */}
          <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
            <p className="text-sm font-semibold text-teal-800">
              Patient Registration
            </p>
            <p className="mt-1 text-xs leading-5 text-teal-700">
              Public registration is available for patients. Doctor accounts
              are created by the administrator.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success} Redirecting to login...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Boolean(success)}
            className="flex w-full items-center justify-center rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Patient Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-7 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-teal-700 hover:text-teal-900 hover:underline"
          >
            Sign In
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your healthcare journey, made simpler with HealthFlow AI.
        </p>
      </div>
    </main>
  );
}

export default Register;

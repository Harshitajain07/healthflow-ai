
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/doctors";

function ManageDoctors() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Get authentication configuration
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Handle expired or invalid sessions
  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return true;
    }

    return false;
  };

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, getAuthConfig());

      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error("Fetch Doctors Error:", err);

      if (handleAuthError(err)) return;

      setError(
        err.message ||
          err.response?.data?.message ||
          "Unable to load doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "admin") {
      navigate(user.role === "doctor" ? "/doctor" : "/patient", {
        replace: true,
      });
      return;
    }

    fetchDoctors();
  }, [user, navigate, fetchDoctors]);

  // Search doctors
  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter(
      (doctor) =>
        doctor.fullName?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query)
    );
  }, [doctors, search]);

  // Reset add form
  const resetAddForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setShowForm(false);
  };

  // Add doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        API_URL,
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        getAuthConfig()
      );

      alert(response.data.message || "Doctor added successfully!");

      resetAddForm();
      await fetchDoctors();
    } catch (err) {
      console.error("Add Doctor Error:", err);

      if (handleAuthError(err)) return;

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to add doctor."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
      );

      alert(response.data.message || "Doctor deleted successfully!");

      await fetchDoctors();
    } catch (err) {
      console.error("Delete Doctor Error:", err);

      if (handleAuthError(err)) return;

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete doctor."
      );
    }
  };

  // Open edit form
  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setEditName(doctor.fullName || "");
    setEditEmail(doctor.email || "");
    setShowForm(false);
  };

  // Update doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    if (!editName.trim() || !editEmail.trim()) {
      alert("Please enter the doctor's name and email.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/${editingDoctor._id}`,
        {
          fullName: editName.trim(),
          email: editEmail.trim().toLowerCase(),
        },
        getAuthConfig()
      );

      alert(response.data.message || "Doctor updated successfully!");

      setEditingDoctor(null);
      await fetchDoctors();
    } catch (err) {
      console.error("Update Doctor Error:", err);

      if (handleAuthError(err)) return;

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update doctor."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] px-5 py-7 text-[#0B1023] sm:px-8 md:px-10 md:py-9">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[2px] text-[#006B64]">
            <Link to="/admin" className="hover:underline">
              ADMINISTRATION
            </Link>
            <span>/</span>
            DOCTORS
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1023]">
            Manage Doctors
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add, update and manage your healthcare professionals.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingDoctor(null);
          }}
          className="rounded-xl bg-[#006B64] px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#00564F]"
        >
          {showForm ? "✕ Close Form" : "＋ Add Doctor"}
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#006B64] to-[#00877C] p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold tracking-[2px] text-teal-100">
            MEDICAL PROFESSIONALS
          </p>

          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Build your healthcare team.
          </h2>

          <p className="mt-3 text-sm leading-6 text-teal-50">
            Keep your medical team organized. Manage doctor accounts and
            maintain an updated directory of professionals.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-4 -top-12 text-[160px] opacity-[0.10]">
          ⚕
        </div>
      </div>

      {/* Summary and Search */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Doctors
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-[#006B64]">
                {doctors.length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              👨‍⚕️
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Showing Results
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-blue-700">
                {filteredDoctors.length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              📋
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-600">
            Search Doctors
          </p>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
            <span className="text-slate-400">⌕</span>

            <input
              type="text"
              placeholder="Name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Doctor Form */}
      {showForm && (
        <form
          onSubmit={handleAddDoctor}
          className="mb-8 rounded-2xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-900/5 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              ➕
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#0B1023]">
                Add New Doctor
              </h2>
              <p className="text-sm text-slate-500">
                Enter the doctor's account details below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter doctor's name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Temporary Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#006B64] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00564F] disabled:opacity-50"
            >
              {saving ? "Saving..." : "✓ Save Doctor"}
            </button>

            <button
              type="button"
              onClick={resetAddForm}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Edit Doctor Form */}
      {editingDoctor && (
        <form
          onSubmit={handleUpdateDoctor}
          className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-900/5 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              ✏️
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#0B1023]">
                Edit Doctor Details
              </h2>
              <p className="text-sm text-slate-500">
                Update the selected doctor's information.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#006B64] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00564F] disabled:opacity-50"
            >
              {saving ? "Updating..." : "✓ Update Doctor"}
            </button>

            <button
              type="button"
              onClick={() => setEditingDoctor(null)}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}

          <button
            onClick={fetchDoctors}
            className="font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B1023]">
              Doctor Directory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              All registered healthcare professionals.
            </p>
          </div>

          <button
            onClick={fetchDoctors}
            disabled={loading}
            className="rounded-lg border border-teal-200 px-4 py-2 text-xs font-bold text-[#006B64] transition hover:bg-teal-50 disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-[#006B64]" />
            <p className="text-sm text-slate-500">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-3 text-4xl">👨‍⚕️</div>

            <h3 className="font-bold text-[#0B1023]">
              {search ? "No matching doctors found" : "No doctors added yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try searching with another name or email."
                : "Add your first doctor to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#F1F8F6] text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-bold">Doctor</th>
                  <th className="px-6 py-4 font-bold">Email Address</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="transition hover:bg-[#F8FCFB]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-[#006B64]">
                          {doctor.fullName?.charAt(0)?.toUpperCase() || "D"}
                        </div>

                        <span className="font-semibold text-[#0B1023]">
                          {doctor.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {doctor.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold capitalize text-[#006B64]">
                        {doctor.role || "doctor"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(doctor)}
                          className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-[#006B64] transition hover:bg-teal-50"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-100 bg-[#FBFDFC] px-6 py-4">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-bold text-[#006B64]">
              {filteredDoctors.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#006B64]">
              {doctors.length}
            </span>{" "}
            doctors
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} HealthFlow AI · Intelligent Healthcare
        Management
      </footer>
    </div>
  );
}

export default ManageDoctors;


import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/patients";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingPatient, setEditingPatient] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  // Admin-only frontend protection
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to={
          user.role === "doctor"
            ? "/doctor"
            : "/patient"
        }
        replace
      />
    );
  }

  // Authentication configuration
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ============================
  // Fetch Patients
  // ============================
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        API_URL,
        getAuthConfig()
      );

      setPatients(response.data.patients || []);
    } catch (err) {
      console.error("Fetch Patients Error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to manage patients.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to load patients. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ============================
  // Search Patients
  // ============================
  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return patients;

    return patients.filter(
      (patient) =>
        patient.fullName?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query)
    );
  }, [patients, search]);

  // ============================
  // Reset Add Form
  // ============================
  const resetAddForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setShowForm(false);
  };

  // ============================
  // Add Patient
  // ============================
  const handleAddPatient = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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

      setSuccess(
        response.data.message || "Patient added successfully!"
      );

      resetAddForm();
      await fetchPatients();
    } catch (err) {
      console.error("Add Patient Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to add patient. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // Delete Patient
  // ============================
  const handleDeletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
      );

      setSuccess(
        response.data.message || "Patient deleted successfully!"
      );

      await fetchPatients();
    } catch (err) {
      console.error("Delete Patient Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete patient."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================
  // Open Edit Form
  // ============================
  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setEditName(patient.fullName || "");
    setEditEmail(patient.email || "");
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  // ============================
  // Update Patient
  // ============================
  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!editName.trim() || !editEmail.trim()) {
      setError("Please enter the patient's name and email.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/${editingPatient._id}`,
        {
          fullName: editName.trim(),
          email: editEmail.trim().toLowerCase(),
        },
        getAuthConfig()
      );

      setSuccess(
        response.data.message || "Patient updated successfully!"
      );

      setEditingPatient(null);
      setEditName("");
      setEditEmail("");

      await fetchPatients();
    } catch (err) {
      console.error("Update Patient Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update patient."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // Page UI
  // ============================
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
            PATIENTS
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1023]">
            Manage Patients
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View, add and manage registered patient accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPatient(null);
            setError("");
            setSuccess("");
          }}
          className="rounded-xl bg-[#006B64] px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#00564F]"
        >
          {showForm ? "✕ Close Form" : "＋ Add Patient"}
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#006B64] to-[#00877C] p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold tracking-[2px] text-teal-100">
            PATIENT MANAGEMENT
          </p>

          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Every patient matters.
          </h2>

          <p className="mt-3 text-sm leading-6 text-teal-50">
            Maintain your patient directory, update account information
            and keep your healthcare community organized.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-4 -top-12 text-[160px] opacity-[0.10]">
          ♧
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          ✓ {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={fetchPatients}
            className="font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary and Search */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Patients
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-[#006B64]">
                {patients.length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              👥
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
                {filteredPatients.length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              📋
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-600">
            Search Patients
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

      {/* Add Patient Form */}
      {showForm && (
        <form
          onSubmit={handleAddPatient}
          className="mb-8 rounded-2xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-900/5 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              ➕
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#0B1023]">
                Add New Patient
              </h2>

              <p className="text-sm text-slate-500">
                Enter the patient's account details below.
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
                placeholder="Enter patient's name"
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
                placeholder="patient@example.com"
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
                minLength={6}
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
              {saving ? "Saving..." : "✓ Save Patient"}
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

      {/* Edit Patient Form */}
      {editingPatient && (
        <form
          onSubmit={handleUpdatePatient}
          className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-900/5 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              ✏️
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#0B1023]">
                Edit Patient Details
              </h2>

              <p className="text-sm text-slate-500">
                Update the selected patient's information.
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
              {saving ? "Updating..." : "✓ Update Patient"}
            </button>

            <button
              type="button"
              onClick={() => setEditingPatient(null)}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Patients Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B1023]">
              Patient Directory
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              All registered patient accounts.
            </p>
          </div>

          <button
            onClick={fetchPatients}
            disabled={loading}
            className="rounded-lg border border-teal-200 px-4 py-2 text-xs font-bold text-[#006B64] transition hover:bg-teal-50 disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-[#006B64]" />

            <p className="text-sm text-slate-500">
              Loading patients...
            </p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-3 text-4xl">👥</div>

            <h3 className="font-bold text-[#0B1023]">
              {search
                ? "No matching patients found"
                : "No patients found"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try searching with another name or email."
                : "Add a patient to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#F1F8F6] text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-bold">Patient</th>
                  <th className="px-6 py-4 font-bold">Email Address</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 text-right font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="transition hover:bg-[#F8FCFB]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                          {patient.fullName?.charAt(0)?.toUpperCase() || "P"}
                        </div>

                        <span className="font-semibold text-[#0B1023]">
                          {patient.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {patient.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                        {patient.role || "patient"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(patient)}
                          className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-[#006B64] transition hover:bg-teal-50"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={() => handleDeletePatient(patient._id)}
                          disabled={deletingId === patient._id}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === patient._id
                            ? "Deleting..."
                            : "🗑 Delete"}
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
              {filteredPatients.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#006B64]">
              {patients.length}
            </span>{" "}
            patients
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} HealthFlow AI · Intelligent Healthcare Management
      </footer>
    </div>
  );
}

export default ManagePatients;

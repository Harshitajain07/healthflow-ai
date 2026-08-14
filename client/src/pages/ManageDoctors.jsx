import { useEffect, useState } from "react";
import axios from "axios";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ===========================
  // Fetch Doctors
  // ===========================
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/doctors"
      );

      setDoctors(response.data.doctors);
    } catch (error) {
      alert("Failed to load doctors");
    }
  };

  // ===========================
  // Add Doctor
  // ===========================
  const handleAddDoctor = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctors",
        {
          fullName,
          email,
          password,
        }
      );

      alert(response.data.message);

      setFullName("");
      setEmail("");
      setPassword("");

      setShowForm(false);

      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  // ===========================
  // Delete Doctor
  // ===========================
  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/doctors/${id}`
      );

      alert(response.data.message);

      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  // ===========================
  // Edit Doctor
  // ===========================
  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setEditName(doctor.fullName);
    setEditEmail(doctor.email);
  };

  // ===========================
  // Update Doctor
  // ===========================
  const handleUpdateDoctor = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/doctors/${editingDoctor._id}`,
        {
          fullName: editName,
          email: editEmail,
        }
      );

      alert(response.data.message);

      setEditingDoctor(null);

      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          👨‍⚕️ Manage Doctors
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          ➕ Add Doctor
        </button>
      </div>

      {/* Add Doctor Form */}

      {showForm && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Add Doctor
          </h2>

          <input
            type="text"
            placeholder="Doctor Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Doctor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={handleAddDoctor}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Save Doctor
          </button>

        </div>
      )}

      {/* Edit Doctor Form */}

      {editingDoctor && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Edit Doctor
          </h2>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <div className="flex gap-3">

            <button
              onClick={handleUpdateDoctor}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Update Doctor
            </button>

            <button
              onClick={() => setEditingDoctor(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* Doctors Table */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {doctors.map((doctor) => (

              <tr key={doctor._id} className="text-center border-b">

                <td className="p-4">{doctor.fullName}</td>

                <td className="p-4">{doctor.email}</td>

                <td className="p-4">{doctor.role}</td>

                <td className="p-4">

                  <button
                    onClick={() => handleEditClick(doctor)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageDoctors;
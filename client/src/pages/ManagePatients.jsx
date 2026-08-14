import { useEffect, useState } from "react";
import axios from "axios";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingPatient, setEditingPatient] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/patients"
      );

      setPatients(response.data.patients);
    } catch (error) {
      alert("Failed to load patients");
    }
  };

  const handleAddPatient = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/patients",
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

      fetchPatients();

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDeletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/patients/${id}`
      );

      alert(response.data.message);

      fetchPatients();

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setEditName(patient.fullName);
    setEditEmail(patient.email);
  };

  const handleUpdatePatient = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/patients/${editingPatient._id}`,
        {
          fullName: editName,
          email: editEmail,
        }
      );

      alert(response.data.message);

      setEditingPatient(null);

      fetchPatients();

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          👥 Manage Patients
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          ➕ Add Patient
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Add Patient
          </h2>

          <input
            type="text"
            placeholder="Patient Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Patient Email"
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
            onClick={handleAddPatient}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Patient
          </button>

        </div>
      )}

      {editingPatient && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Edit Patient
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

          <button
            onClick={handleUpdatePatient}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Update Patient
          </button>

        </div>
      )}

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

            {patients.map((patient) => (

              <tr key={patient._id} className="text-center border-b">

                <td className="p-4">{patient.fullName}</td>

                <td className="p-4">{patient.email}</td>

                <td className="p-4">{patient.role}</td>

                <td className="p-4">

                  <button
                    onClick={() => handleEditClick(patient)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeletePatient(patient._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

export default ManagePatients;
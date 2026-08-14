function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-blue-700">
          🏥 HealthFlow AI Dashboard
        </h1>

        <p className="mt-6 text-xl">
          Welcome,
          <span className="font-bold text-blue-600">
            {" "}
            {user?.fullName}
          </span>
        </p>

        <p className="mt-2">
          Email: {user?.email}
        </p>

        <p className="mt-2">
          Role: {user?.role}
        </p>

      </div>
    </div>
  );
}

export default Dashboard;
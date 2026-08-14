function Stats() {
  return (
    <section className="py-20 bg-blue-50 rounded-3xl mt-20">

      <h2 className="text-5xl font-bold text-center text-blue-700">
        Trusted by Thousands of Patients
      </h2>

      <div className="grid grid-cols-4 gap-8 mt-14 text-center">

        <div>
          <h3 className="text-5xl">👨‍⚕️</h3>
          <p className="text-4xl font-bold text-blue-700 mt-4">120+</p>
          <p className="text-gray-600 mt-2">Expert Doctors</p>
        </div>

        <div>
          <h3 className="text-5xl">🧑‍🤝‍🧑</h3>
          <p className="text-4xl font-bold text-blue-700 mt-4">10,000+</p>
          <p className="text-gray-600 mt-2">Happy Patients</p>
        </div>

        <div>
          <h3 className="text-5xl">📅</h3>
          <p className="text-4xl font-bold text-blue-700 mt-4">25,000+</p>
          <p className="text-gray-600 mt-2">Appointments</p>
        </div>

        <div>
          <h3 className="text-5xl">🏥</h3>
          <p className="text-4xl font-bold text-blue-700 mt-4">15+</p>
          <p className="text-gray-600 mt-2">Hospital Branches</p>
        </div>

      </div>

    </section>
  );
}

export default Stats;
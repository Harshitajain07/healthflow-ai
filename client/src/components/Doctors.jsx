function Doctors() {
  return (
    <section id="doctors" className="py-20">

      <h2 className="text-5xl font-extrabold text-center text-blue-700">
        Meet Our Expert Doctors
      </h2>

      <p className="text-center text-gray-600 mt-4">
        Consult experienced specialists anytime, anywhere.
      </p>

      <div className="grid grid-cols-3 gap-8 mt-14">

        {/* Doctor 1 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 hover:shadow-2xl transition duration-300">

          <div className="text-7xl">👨‍⚕️</div>

          <h3 className="text-2xl font-bold mt-5">
            Dr. Sarah Wilson
          </h3>

          <p className="text-blue-600 font-semibold mt-2">
            Cardiologist
          </p>

          <p className="mt-3 text-yellow-500 text-xl">
            ⭐⭐⭐⭐⭐
          </p>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-300">
            Book Now
          </button>

        </div>

        {/* Doctor 2 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 hover:shadow-2xl transition duration-300">

          <div className="text-7xl">👨‍⚕️</div>

          <h3 className="text-2xl font-bold mt-5">
            Dr. John Smith
          </h3>

          <p className="text-green-600 font-semibold mt-2">
            Neurologist
          </p>

          <p className="mt-3 text-yellow-500 text-xl">
            ⭐⭐⭐⭐⭐
          </p>

          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-300">
            Book Now
          </button>

        </div>

        {/* Doctor 3 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 hover:shadow-2xl transition duration-300">

          <div className="text-7xl">👩‍⚕️</div>

          <h3 className="text-2xl font-bold mt-5">
            Dr. Emily Davis
          </h3>

          <p className="text-purple-600 font-semibold mt-2">
            Pediatrician
          </p>

          <p className="mt-3 text-yellow-500 text-xl">
            ⭐⭐⭐⭐⭐
          </p>

          <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-300">
            Book Now
          </button>

        </div>

      </div>

    </section>
  );
}

export default Doctors;
function Features() {
  return (
    <section id="features" className="py-20">

      <h2 className="text-5xl font-extrabold text-center text-blue-700">
        Why Choose HealthFlow AI?
      </h2>

      <p className="text-center text-gray-600 mt-4">
        Everything you need for smart healthcare in one place.
      </p>

      <div className="grid grid-cols-3 gap-8 mt-14">

        {/* Card 1 */}
        <div className="bg-blue-50 shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300 border border-blue-100">

          <div className="text-6xl">
            🩺
          </div>

          <h3 className="text-2xl font-bold mt-5">
            Book Appointment
          </h3>

          <p className="text-gray-600 mt-3">
            Easily schedule appointments with experienced doctors in just a few clicks.
          </p>

        </div>

        {/* Card 2 */}
        <div className="bg-green-50 shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300 border border-green-100">

          <div className="text-6xl">
            🤖
          </div>

          <h3 className="text-2xl font-bold mt-5">
            AI Assistant
          </h3>

          <p className="text-gray-600 mt-3">
            Get instant AI-powered health guidance and medicine information anytime.
          </p>

        </div>

        {/* Card 3 */}
        <div className="bg-purple-50 shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300 border border-purple-100">

          <div className="text-6xl">
            📄
          </div>

          <h3 className="text-2xl font-bold mt-5">
            Medical Records
          </h3>

          <p className="text-gray-600 mt-3">
            Securely upload, manage and access your medical reports from anywhere.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Features;
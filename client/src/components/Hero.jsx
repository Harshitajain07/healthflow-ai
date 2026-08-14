import heroImage from "../assets/hero.png";

function Hero() {
  return (
    <section className="flex justify-between items-center min-h-[85vh] py-16">

      <div className="w-1/2 pr-10">

        <h1 className="text-6xl font-extrabold text-blue-700 leading-tight tracking-tight">
            Smart AI Hospital
                <br />
           
            Management System
        </h1>

        <p className="mt-6 text-gray-600 text-xl leading-8">
           Book appointments, manage prescriptions, consult experienced
           doctors, upload medical reports and get AI-powered healthcare
           assistance in one place.
        </p>

        <div className="mt-10 flex gap-6">

          <button className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-lg transition duration-300">
            Book Appointment
          </button>

          <button className="bg-green-600 hover:bg-green-700 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-lg transition duration-300">
            Talk to AI
          </button>

        </div>

      </div>

      <div className="w-1/2 flex justify-center">

        <img
          src={heroImage}
          alt="Hero"
          className="w-[620px] rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
        />

      </div>

    </section>
  );
}

export default Hero;

import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Hero() {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (user.role === "patient") {
      navigate("/book-appointment");
    } else if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const handleTalkToAI = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    navigate("/ai-chat");
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-center min-h-[85vh] py-16 gap-10">
      <div className="w-full md:w-1/2 md:pr-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 leading-tight tracking-tight">
          Smart AI Hospital
          <br />
          Management System
        </h1>

        <p className="mt-6 text-gray-600 text-lg leading-8">
          Book appointments, manage prescriptions, consult experienced
          doctors, upload medical reports and get AI-powered healthcare
          assistance in one place.
        </p>

        <div className="mt-10 flex flex-wrap gap-5">
          <button
            type="button"
            onClick={handleBookAppointment}
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-lg transition duration-300 cursor-pointer"
          >
            Book Appointment
          </button>

          <button
            type="button"
            onClick={handleTalkToAI}
            className="bg-green-600 hover:bg-green-700 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-lg transition duration-300 cursor-pointer"
          >
            Talk to AI
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={heroImage}
          alt="Doctors outside a hospital"
          className="w-full max-w-[620px] rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
        />
      </div>
    </section>
  );
}

export default Hero;

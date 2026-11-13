
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDoctors(response.data.doctors || []);
        } else {
          setError("Unable to load doctors right now.");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Doctors could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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

  return (
    <section
      id="doctors"
      className="scroll-mt-24 border-t border-slate-100 bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800 sm:text-sm">
              Care from professionals
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Meet our specialist{" "}
              <span className="text-teal-700">care team.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Explore the doctors registered with HealthFlow AI and start
              your appointment journey in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBookAppointment}
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-700 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
          >
            Find a doctor
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 p-7"
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                <div className="mt-5 h-5 w-40 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-52 max-w-full rounded bg-slate-100" />
                <div className="mt-6 h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            {error}
          </p>
        ) : doctors.length === 0 ? (
          <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            No doctors are registered yet. Please check back later.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {doctors.map((doctor, index) => {
              const colors = [
                "bg-teal-50 text-teal-800",
                "bg-sky-50 text-sky-800",
                "bg-violet-50 text-violet-800",
              ];

              const initials = (doctor.fullName || "Doctor")
                .replace(/^Dr\.?\s*/i, "")
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <article
                  key={doctor._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Registered doctor
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${colors[index % colors.length]}`}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-bold tracking-tight text-slate-950">
                          {doctor.fullName}
                        </h3>
                        <p className="mt-1 break-all text-sm text-slate-500">
                          {doctor.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="text-xs leading-5 text-slate-500">
                        Contact details are shown as registered. Please
                        confirm availability when booking.
                      </p>

                      <button
                        type="button"
                        onClick={handleBookAppointment}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-100"
                      >
                        Book an appointment
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h14m-6-6 6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Doctors;




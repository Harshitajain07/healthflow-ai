
const stats = [
  {
    value: "01",
    label: "Appointment management",
    description: "Book and track appointments in one place.",
  },
  {
    value: "02",
    label: "AI health tools",
    description: "Explore AI-assisted health information.",
  },
  {
    value: "03",
    label: "Medical documents",
    description: "Review reports and prescription information.",
  },
  {
    value: "04",
    label: "Connected dashboards",
    description: "Dedicated workflows for patients, doctors, and admins.",
  },
];

function Stats() {
  return (
    <section className="border-t border-slate-200 bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300 sm:text-sm">
                Built around your care journey
              </p>

              <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                One platform.
                <span className="block text-teal-300">
                  Connected healthcare.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                HealthFlow AI brings appointment workflows, AI-powered
                assistance, and medical document tools into a single
                healthcare management experience.
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Designed for a connected care experience
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:border-teal-300/40 hover:bg-white/[0.07] sm:p-6"
                >
                  <span className="text-sm font-semibold tracking-widest text-teal-300">
                    {stat.value}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {stat.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-6 text-slate-500">
          AI-generated information is for informational support and does not
          replace professional medical advice.
        </p>
      </div>
    </section>
  );
}

export default Stats;

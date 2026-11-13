
function Dashboard() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Unable to read user details:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Welcome section */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-600 p-8 text-white shadow-lg sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-100">
                HealthFlow AI
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
                Your healthcare journey, organized in one place.
                Manage your health information with ease.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl">
              🏥
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-800">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your registered HealthFlow AI account details.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl">
                👤
              </div>
              <p className="text-sm font-medium text-slate-500">Full Name</p>
              <p className="mt-2 break-words text-lg font-semibold text-slate-800">
                {user?.fullName || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl">
                ✉️
              </div>
              <p className="text-sm font-medium text-slate-500">Email Address</p>
              <p className="mt-2 break-words text-lg font-semibold text-slate-800">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl">
                🛡️
              </div>
              <p className="text-sm font-medium text-slate-500">Account Role</p>
              <p className="mt-2 capitalize text-lg font-semibold text-slate-800">
                {user?.role || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Information note */}
        <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="font-semibold text-teal-900">
                Your health, in focus
              </h3>
              <p className="mt-1 text-sm leading-6 text-teal-800">
                Use the navigation menu to access the healthcare tools and
                features available for your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

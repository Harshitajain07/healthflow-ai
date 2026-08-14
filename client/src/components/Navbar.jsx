import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg rounded-xl px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-2xl font-bold">
        🏥 HealthFlow AI
      </h1>

      {/* Navigation Links */}
      <ul className="flex gap-8 text-lg">

      <li>
        <a href="/" className="hover:text-yellow-300 transition">
          Home
        </a>
      </li>

      <li>
        <a href="#doctors" className="hover:text-yellow-300 transition">
          Doctors
        </a>
      </li>

      <li>
        <a href="#features" className="hover:text-yellow-300 transition">
            Services
        </a>
      </li>

      <li>
        <a href="#footer" className="hover:text-yellow-300 transition">
          Contact
        </a>
      </li>

      </ul>

      {/* Login Button */}
    <Link
      to="/login"
      className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
      Login
      </Link>

    </nav>
  );
}

export default Navbar;
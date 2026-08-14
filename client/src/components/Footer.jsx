function Footer() {
  return (
    <footer
      id="footer"
      className="bg-blue-700 text-white rounded-t-3xl mt-20 py-10"
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold">
            🏥 HealthFlow AI
          </h2>

          <p className="mt-2 text-blue-100">
            AI Powered Hospital Management System
          </p>
        </div>

        <div className="text-right">
          <p>📧 support@healthflowai.com</p>
          <p className="mt-2">📞 +91 98765 43210</p>
        </div>

      </div>

      <hr className="my-6 border-blue-500" />

      <p className="text-center text-blue-200">
        © 2026 HealthFlow AI. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
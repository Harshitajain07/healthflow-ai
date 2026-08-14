function AIAssistant() {
  return (
    <section className="py-20 mt-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl text-white">

      <div className="text-center">

        <h2 className="text-5xl font-bold">
          🤖 AI Health Assistant
        </h2>

        <p className="mt-6 text-xl max-w-3xl mx-auto">
          Experience smart healthcare with our AI-powered assistant.
          Check symptoms, understand medicines, summarize medical reports,
          and get healthcare guidance anytime.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-10 mt-16 max-w-5xl mx-auto">

        <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
          ✅ AI Symptom Checker
        </div>

        <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
          💊 Medicine Information
        </div>

        <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
          📄 Report Summarizer
        </div>

        <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
          💬 AI Chatbot
        </div>

      </div>

      <div className="text-center mt-14">
        <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300">
          Try AI Assistant
        </button>
      </div>

    </section>
  );
}

export default AIAssistant;
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Doctors from "../components/Doctors";
import Stats from "../components/Stats";
import AIAssistant from "../components/AIAssistant";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navigation */}
      <header className="relative z-50 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>
      </header>

      {/* Main content */}
      <main className="w-full">
        <section id="home">
          <Hero />
        </section>

        <section id="features" className="scroll-mt-20">
          <Features />
        </section>

        <section id="doctors" className="scroll-mt-20">
          <Doctors />
        </section>

        <section id="stats" className="scroll-mt-20">
          <Stats />
        </section>

        <section id="ai-assistant" className="scroll-mt-20">
          <AIAssistant />
        </section>
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;

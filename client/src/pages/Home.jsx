
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Doctors from "../components/Doctors";
import Stats from "../components/Stats";
import AIAssistant from "../components/AIAssistant";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-8">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Doctors />
          <Stats />
          <AIAssistant />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;


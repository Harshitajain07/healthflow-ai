import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Doctors from "../components/Doctors";
import Stats from "../components/Stats";
import AIAssistant from "../components/AIAssistant";

function Home() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8">
        <Navbar />
        <Hero />
        <Features />
        <Doctors />
        <Stats />
        <AIAssistant />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import About from './components/About';
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Blogs from "./components/Blogs";

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <About />
    <Services />
    <Portfolio />
    <Blogs />
    </>
  );
}

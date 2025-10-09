import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import About from './components/About';
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Blogs from "./components/Blogs";
import Price from "./components/Price";
import Contact from "./components/Contact";
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <About />
    <Services />
    <Portfolio />
    <Blogs />
    <Price />
    <Contact />
    <Footer />
    </>
  );
}

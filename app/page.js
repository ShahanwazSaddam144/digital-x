'use client';

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
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
  const slowToastId = useRef(null);
  const lastLatencyRef = useRef(0);

  useEffect(() => {

    function handleOffline() {
      toast.error(" You’re offline — check your internet connection.");
    }

    function handleOnline() {
      toast.success(" Back online! You can continue now.");
      toast.dismiss(slowToastId.current);
      slowToastId.current = null;
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    let pingTimer;
    const checkNetworkSpeed = async () => {
      if (!navigator.onLine) return;

      const start = performance.now();
      try {

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        await fetch("https://www.google.com/favicon.ico?cachebust=" + Date.now(), {
          signal: controller.signal,
          cache: "no-store",
          mode: "no-cors",
        });
        clearTimeout(timeout);
        const latency = performance.now() - start;
        lastLatencyRef.current = latency;

        if (latency > 2500 && !slowToastId.current) {
          slowToastId.current = toast.loading("⚠️ Connection seems slow... please hang tight.", {
            id: "slow-connection",
          });
        } else if (latency <= 2500 && slowToastId.current) {
          toast.success("🚀 Connection speed restored!", { id: "slow-connection" });
          toast.dismiss(slowToastId.current);
          slowToastId.current = null;
        }
      } catch {
        if (!slowToastId.current) {
          slowToastId.current = toast.loading("⚠️ Network seems unstable...", {
            id: "slow-connection",
          });
        }
      }
    };

    pingTimer = setInterval(checkNetworkSpeed, 9 * 1000);

    return () => {
      clearInterval(pingTimer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Blogs />
      <Price />
      {/* <Contact /> */}
      <Footer />
    </>
  );
}

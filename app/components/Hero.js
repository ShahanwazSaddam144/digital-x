import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white min-h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        We Build Digital Experiences That Grow Your Business
      </h1>
      <p className="mt-4 text-lg text-gray-100 max-w-2xl">
        Digital-X is a creative agency helping brands shine through strategy,
        design, and marketing excellence.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="#contact"
          className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Get a Free Quote
        </Link>
        <Link
          href="#services"
          className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition"
        >
          Our Services
        </Link>
      </div>
    </section>
  );
};

export default Hero;

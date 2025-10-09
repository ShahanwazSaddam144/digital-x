"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-6">
      {/* 404 Illustration */}

      {/* Text Section */}
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-2xl mt-4 font-semibold text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="mt-3 text-gray-600 max-w-md">
        It seems the page you’re looking for doesn’t exist or has been moved.
        Let’s get you back to where you belong.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
      >
        Go Back Home
      </Link>

      {/* Decorative Element */}
      <div className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Digital-X. All rights reserved.
      </div>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = ({ handleClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            width={300}
            height={300}
            src="/butt.png"
            alt="Digital-X Logo"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
            Digital<span className="text-gray-900 dark:text-white">-X</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="#about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="#services" className="hover:text-blue-600 transition">
            Services
          </Link>
          <Link href="#portfolio" className="hover:text-blue-600 transition">
            Portfolio
          </Link>
          <Link href="#contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 space-y-4">
          <Link
            href="/"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#about"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="#services"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#portfolio"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Portfolio
          </Link>
          <Link
            href="#contact"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="#contact"
            className="block text-center bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;

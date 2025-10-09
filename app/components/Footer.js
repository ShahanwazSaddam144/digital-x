import React from "react";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-gray-200 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-blue-400 mb-4">Digital-X</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Empowering your business with innovative digital solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="#about" className="hover:text-blue-400 transition">About</a></li>
            <li><a href="#services" className="hover:text-blue-400 transition">Services</a></li>
            <li><a href="#pricing" className="hover:text-blue-400 transition">Pricing</a></li>
            <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" /> Lahore, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-blue-400" /> +92 300 1234567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-blue-400" /> support@digitalx.com
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Follow Us</h3>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-400 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition"><Linkedin size={20} /></a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-blue-400 font-semibold">Digital-X</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  Megaphone,
  Code2,
  Globe,
  BrainCircuit,
  Smartphone,
  Palette,
  PenTool,
} from "lucide-react";

const services = [
  {
    Name: "Digital-Marketing",
    Expert: "Sheikh Yusha",
    Desc: "We help your brand grow through targeted campaigns, SEO optimization, and social media marketing strategies.",
  },
  {
    Name: "Software Developer",
    Expert: "Wahb Amir",
    Desc: "We design and build scalable, high-performance software tailored to your business needs.",
  },
  {
    Name: "Web Development",
    Expert: "Shahnawaz Saddam Butt",
    Desc: "We create responsive, fast, and visually stunning websites that elevate your online presence.",
  },
  {
    Name: "AI Learning",
    Expert: "Wahb Amir",
    Desc: "We implement AI-driven models and machine learning solutions to automate and optimize your business processes.",
  },
  {
    Name: "App Development",
    Expert: "Shahnawaz Saddam Butt",
    Desc: "We build mobile apps for Android and iOS with smooth performance, user-friendly interfaces, and modern UI/UX design.",
  },
  {
    Name: "Graphic Designing",
    Expert: "Sheikh Yusha",
    Desc: "We design engaging visuals, branding materials, and marketing assets that make your business visually compelling.",
  },
  {
    Name: "Content Creation",
    Expert: "Shahnawaz Saddam Butt",
    Desc: "We craft high-quality digital content, including blog posts, social media creatives, and video scripts that boost engagement and brand storytelling.",
  },
];

// 🧠 Icon selector based on service name
const getIcon = (name) => {
  switch (name) {
    case "Digital-Marketing":
      return <Megaphone className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "Software Developer":
      return <Code2 className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "Web Development":
      return <Globe className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "AI Learning":
      return <BrainCircuit className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "App Development":
      return <Smartphone className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "Graphic Designing":
      return <Palette className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    case "Content Creation":
      return <PenTool className="text-blue-500 w-10 h-10 mb-3 mx-auto" />;
    default:
      return null;
  }
};

const Services = () => {
  return (
    <section className="mt-10" id="services">
      {/* Header */}
      <header className="flex flex-col justify-center items-center text-center">
        <h1 className="font-extrabold text-4xl mb-2 sm:text-5xl text-blue-400">
          Our <span className="text-blue-600">Services</span>
        </h1>
        <p className="font-semibold text-gray-700 max-w-2xl">
          Empowering your business with innovative digital solutions.
        </p>
      </header>

      {/* Swiper Section */}
      <div className="mt-10 mb-10 px-6">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
                {getIcon(service.Name)}
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  {service.Name}
                </h2>
                <p className="text-gray-700 font-semibold mb-1">
                  Expert: {service.Expert}
                </p>
                <p className="text-gray-600 text-sm">{service.Desc}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Services;

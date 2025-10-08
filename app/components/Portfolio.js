"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const portfolio = [
  {
    Image: "/portfolio1.jpg",
    Name: "Social Media Marketing",
    Client: "Ali Rehman",
    Review: "Excellent collaboration! Helped boost our online reach.",
  },
  {
    Image: "/portfolio1.jpg",
    Name: "App Development",
    Client: "Ali Rehman",
    Review: "Delivered an intuitive app with great performance!",
  },
  {
    Image: "/portfolio1.jpg",
    Name: "Web Development",
    Client: "Syed Zeeshan Haider",
    Review: "Created a beautiful and fast website. Highly recommended!",
  },
  {
    Image: "/portfolio1.jpg",
    Name: "Graphic Design",
    Client: "Hassan Ahmed",
    Review: "Outstanding creativity! Our visuals look amazing.",
  },
  {
    Image: "/portfolio1.jpg",
    Name: "SEO Optimization",
    Client: "Maryam Khan",
    Review: "Improved our rankings dramatically. Fantastic work!",
  },
  {
    Image: "/portfolio1.jpg",
    Name: "E-commerce Website",
    Client: "Hamza Sheikh",
    Review: "Smooth checkout experience and modern design!",
  },
];

const Portfolio = () => {
  return (
    <>
      {/* Header */}
      <section className="mt-20" id="portfolio">
        <header className="flex flex-col justify-center items-center text-center mb-10">
          <h1 className="font-extrabold text-4xl mb-2 sm:text-5xl text-blue-400">
            Our <span className="text-blue-600">Portfolio</span>
          </h1>
          <p className="font-semibold text-gray-700 max-w-2xl">
            Discover how we turn ideas into impactful digital experiences.
          </p>
        </header>
      </section>

      {/* Swiper Slider */}
      <section className="px-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {portfolio.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <Image
                  src={project.Image}
                  width={500}
                  height={300}
                  alt={project.Name}
                  className="rounded-xl w-full object-cover mb-4"
                />
                <h2 className="text-xl font-bold text-blue-600 mb-1">
                  {project.Name}
                </h2>
                <p className="text-gray-700 font-semibold">
                  Client: {project.Client}
                </p>
                <p className="text-gray-600 text-sm mt-2">“{project.Review}”</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default Portfolio;

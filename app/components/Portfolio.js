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
    Image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    Name: "App Development",
    Client: "Ali Rehman",
    Review: "Delivered an intuitive app with great performance!",
  },
  {
    Image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    Name: "Web Development",
    Client: "Syed Zeeshan Haider",
    Review: "Created a beautiful and fast website. Highly recommended!",
  },
  {
    Image: "/portfolio4.jpg",
    Name: "Graphic Design",
    Client: "Hassan Ahmed",
    Review: "Outstanding creativity! Our visuals look amazing.",
  },
  {
    Image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    Name: "SEO Optimization",
    Client: "Maryam Khan",
    Review: "Improved our rankings dramatically. Fantastic work!",
  },
  {
    Image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    Name: "E-commerce Website",
    Client: "Hamza Sheikh",
    Review: "Smooth checkout experience and modern design!",
  },
];

const analytics = [
  { value: "98%", label: "Client Satisfaction" },
  { value: "120+", label: "Completed Projects" },
  { value: "75+", label: "Active Clients" },
  { value: "150%", label: "Business Growth" },
  { value: "10+", label: "Years of Experience" },
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

      {/* Portfolio Swiper */}
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
              <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
                <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden rounded-xl mb-4">
                  <Image
                    src={project.Image}
                    alt={project.Name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-blue-600 mb-1 text-center">
                  {project.Name}
                </h2>
                <p className="text-gray-700 font-semibold text-center">
                  Client: {project.Client}
                </p>
                <p className="text-gray-600 text-sm mt-2 text-center">
                  “{project.Review}”
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Client Satisfaction & Analytics (with Swiper) */}
      <section className="w-full py-20" id="analytics">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400">
            Client <span className="text-blue-600">Satisfaction & Analytics</span>
          </h1>
          <p className="text-gray-700 mt-3 font-medium max-w-2xl mx-auto">
            Our success is driven by trust, collaboration, and results — here’s a look at our performance metrics.
          </p>
        </div>

        <div className="px-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {analytics.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white w-full h-[160px] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center border border-gray-100">
                  <h2 className="text-5xl font-extrabold text-blue-600 mb-2">
                    {item.value}
                  </h2>
                  <p className="text-gray-700 font-semibold">{item.label}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bottom Line */}
        <div className="mt-14 text-center">
          <p className="text-gray-600 font-medium max-w-3xl mx-auto">
            Each number represents the dedication and excellence of our team at{" "}
            <span className="text-blue-600 font-semibold">Digital-X</span> — 
            turning ideas into impactful digital experiences for clients worldwide.
          </p>
        </div>
      </section>
    </>
  );
};

export default Portfolio;

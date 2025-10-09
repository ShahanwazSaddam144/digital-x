"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const team = [
  {
    Icon: "/developer.jpg",
    Name: "Shahnawaz Saddam Butt",
    Role: "CEO and Full Stack Developer",
    GitHub: "https://github.com/ShahanwazSaddam144?tab=repositories",
    Profile: "https://shahnawaz.buttnetworks.com/",
  },
  {
    Icon: "/developer2.svg",
    Name: "Wahb Amir",
    Role: "CO-Founder and Software Developer",
    GitHub: "https://github.com/coder101-js?tab=repositories",
    Profile: "https://wahb.space/",
  },
    {
    Icon: "/developer.jpg",
    Name: "Robert Ali",
    Role: "Our Digital-Marketing Expert",
    GitHub: "https://github.com/coder101-js?tab=repositories",
    Profile: "https://wahb.space/",
  },
];

const About = () => {
  return (
    <>
      {/* ABOUT SECTION */}
      <section
        id="about"
        className="w-full py-20 bg-white flex flex-col items-center px-6"
      >
        {/* Section Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400">
            About <span className="text-blue-600">Digital-X</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We’re a full-service digital agency dedicated to transforming brands
            through strategy, creativity, and technology.
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Left Side - Image */}
          <div className="md:w-1/2">
            <Image
              src="/banner1.jpg"
              width={500}
              height={500}
              alt="About Digital-X"
              className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Side - Text */}
          <div className="md:w-1/2 text-gray-700 space-y-5">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Who We Are
            </h2>
            <p>
              <strong>Digital-X</strong> is your growth partner in the digital
              world — combining design, strategy, and marketing to build
              high-performing brands.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                We build trust through transparency and consistent results.
              </li>
              <li>Tailored digital solutions for startups to enterprises.</li>
              <li>Expertise in web design, SEO, and digital advertising.</li>
              <li>
                Driven by creativity, powered by data, and focused on results.
              </li>
              <li>
                Expertise Building Mobile Apps and Softwares that boost your
                business.
              </li>
            </ul>

            {/* Call to Action */}
            <Link href="#Team">
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Learn More
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-gray-50" id="Team">
        <h1 className="text-center font-extrabold text-4xl sm:text-5xl text-blue-400 mb-12">
          Our <span className="text-blue-600">Team</span>
        </h1>

        <div className="max-w-6xl mx-auto px-6">
          <Swiper
            spaceBetween={40}
            slidesPerView={1}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="team-swiper"
          >
            {team.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                  <Image
                    src={member.Icon}
                    width={180}
                    height={180}
                    alt={`${member.Name} photo`}
                    className="rounded-full object-cover shadow-md hover:scale-105 transition-transform duration-500"
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    {member.Name}
                  </h2>
                  <p className="text-blue-500 font-medium mb-3">
                    {member.Role}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <a
                      href={member.GitHub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      GitHub
                    </a>
                    <a
                      href={member.Profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Portfolio
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default About;

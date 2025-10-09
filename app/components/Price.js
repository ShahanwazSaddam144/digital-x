"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Price = () => {
  return (
    <>
      <section className="mt-10 mb-5">
        <header className="flex flex-col justify-center items-center text-center">
          <h1 className="font-extrabold text-4xl mb-2 sm:text-5xl text-blue-400">
            Our <span className="text-blue-600">Pricing</span>
          </h1>
          <p className="font-semibold text-gray-700 max-w-2xl">
            Choose a plan that fits your goals and budget — grow smarter with us.
          </p>
        </header>
      </section>

      {/* Packages with Swiper */}
      <section className="mt-10 mb-20 px-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="w-full"
        >
          {/* Starter Plan */}
          <SwiperSlide>
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center border-t-4 border-blue-400 hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-blue-600 mb-3">Starter</h2>
              <p className="text-gray-600 mb-5">
                Perfect for individuals or small startups beginning their digital journey.
              </p>
              <h3 className="text-3xl font-extrabold text-blue-500 mb-4">
                $49<span className="text-base text-gray-500">/mo</span>
              </h3>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li>✔ Basic Website Setup</li>
                <li>✔ SEO Optimization</li>
                <li>✔ Email Support</li>
              </ul>
              <button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition-all">
                Get Started
              </button>
            </div>
          </SwiperSlide>

          {/* Growth Plan */}
          <SwiperSlide>
            <div className="bg-blue-50 shadow-xl rounded-2xl p-8 text-center border-t-4 border-blue-600 hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-blue-700 mb-3">Growth</h2>
              <p className="text-gray-700 mb-5">
                Ideal for growing businesses that want to expand their online presence.
              </p>
              <h3 className="text-3xl font-extrabold text-blue-600 mb-4">
                $99<span className="text-base text-gray-500">/mo</span>
              </h3>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li>✔ Advanced SEO & Analytics</li>
                <li>✔ Social Media Management</li>
                <li>✔ 24/7 Support</li>
              </ul>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all">
                Choose Plan
              </button>
            </div>
          </SwiperSlide>

          {/* Enterprise Plan */}
          <SwiperSlide>
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center border-t-4 border-blue-800 hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-blue-800 mb-3">Enterprise</h2>
              <p className="text-gray-600 mb-5">
                Best for enterprises needing full-scale digital transformation.
              </p>
              <h3 className="text-3xl font-extrabold text-blue-700 mb-4">
                $199<span className="text-base text-gray-500">/mo</span>
              </h3>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li>✔ Custom Website & Branding</li>
                <li>✔ Dedicated Manager</li>
                <li>✔ Priority Support</li>
              </ul>
              <button className="bg-blue-800 text-white px-5 py-2 rounded-xl hover:bg-blue-900 transition-all">
                Contact Us
              </button>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </>
  );
};

export default Price;

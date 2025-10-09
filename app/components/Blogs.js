"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const articles = [
  {
    title: "Top 5 Marketing Trends to Watch in 2025",
    desc: "Discover emerging strategies transforming digital marketing — from AI automation to personalized ad experiences.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    author: "Shahnawaz Saddam Butt",
    date: "Oct 5, 2025",
  },
  {
    title: "SEO Secrets: Rank Higher with Google’s 2025 Algorithm",
    desc: "Learn the latest techniques to improve your search visibility and drive more organic traffic to your business.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    author: "Digital-X Team",
    date: "Sept 28, 2025",
  },
  {
    title: "Mastering Social Media Ads for Maximum ROI",
    desc: "Uncover proven strategies to boost engagement, conversions, and brand loyalty through social media advertising.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    author: "Zeeshan Haider",
    date: "Sept 20, 2025",
  },
  {
    title: "Content that Converts: The Power of Visual Branding",
    desc: "See how powerful design and storytelling can elevate your digital presence and win audience trust.",
    image: "https://images.unsplash.com/photo-1522199710521-72d69614c702",
    author: "Hassan Ahmed",
    date: "Sept 10, 2025",
  },
];

const Blogs = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMsg(data.message || "✅ Subscribed successfully!");
      setFormData({ email: "" });
    } catch (error) {
      setResponseMsg("❌ Error subscribing. Please try again.");
    }

    setTimeout(() => setResponseMsg(""), 3000);
  };

  return (
    <>
      {/* Articles Section */}
      <section id="articles" className="py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400">
            Latest <span className="text-blue-600">Articles & Insights</span>
          </h1>
          <p className="text-gray-700 mt-3 font-medium max-w-2xl mx-auto">
            Stay ahead with expert tips on marketing, SEO, and social media trends shaping the digital world.
          </p>
        </div>

        <div className="px-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {articles.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative w-full cursor-pointer h-60">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-blue-600 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>By {item.author}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-14 text-center">
          <p className="text-gray-600 font-medium max-w-3xl mx-auto">
            At <span className="text-blue-600 font-semibold">Digital-X</span>, we share insights that empower businesses to grow, adapt, and lead in the digital era.
          </p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mt-5 mb-10 py-16 px-6">
        <header className="flex flex-col justify-center items-center text-center mb-8">
          <h1 className="font-extrabold text-4xl sm:text-5xl text-blue-400 mb-2">
            Our <span className="text-blue-600">Newsletter</span>
          </h1>
          <p className="font-semibold text-gray-700 max-w-2xl">
            Stay ahead in the digital era — get the latest strategies, trends, and insights.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto mt-6 bg-white shadow-md rounded-full px-4 py-3 border border-gray-100"
        >
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            Subscribe
          </button>
        </form>

        {responseMsg && (
          <p className="text-center mt-4 text-gray-700 font-medium">{responseMsg}</p>
        )}

        <p className="text-center text-gray-600 font-medium mt-6">
          Empowering your business with innovative digital solutions.
        </p>
      </section>
    </>
  );
};

export default Blogs;

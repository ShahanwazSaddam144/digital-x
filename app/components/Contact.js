"use client";

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Project: '',
    Message: '',
  });

  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponseMsg(data.message || '✅ Sent!');
    } catch (err) {
      setResponseMsg('❌ Error sending message.');
    }

    setTimeout(() => setResponseMsg(''), 3000);
  };

  return (
    <section id='contact' className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex flex-col justify-center items-center text-center">
        <h1 className="font-extrabold text-4xl mb-2 sm:text-5xl text-blue-400">
          Our <span className="text-blue-600">Contact</span>
        </h1>
        <p className="font-semibold text-gray-700 max-w-2xl mb-5">
          Reach out to start your digital transformation journey today.
        </p>
      </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="Name"
            placeholder="Your Name"
            onChange={handleChange}
            value={formData.Name}
            required
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 outline-none transition duration-200"
          />

          <input
            name="Email"
            type="email"
            placeholder="Your Email"
            onChange={handleChange}
            value={formData.Email}
            required
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 outline-none transition duration-200"
          />

          <input
            name="Phone"
            placeholder="Your Phone"
            onChange={handleChange}
            value={formData.Phone}
            required
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 outline-none transition duration-200"
          />

            <textarea
            name="Project"
            placeholder="Your Project (e.g web,app or etc, etc.)"
            onChange={handleChange}
            value={formData.Project}
            required
            rows="1"
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 outline-none transition duration-200 resize-none"
          />

          <textarea
            name="Message"
            placeholder="Your Message"
            onChange={handleChange}
            value={formData.Message}
            required
            rows="4"
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 outline-none transition duration-200 resize-none"
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Message
          </button>
        </form>

        {responseMsg && (
          <p className="mt-6 text-center text-sm text-green-600 font-medium">
            {responseMsg}
          </p>
        )}
      </div>
    </section>
  );
};

export default Contact;


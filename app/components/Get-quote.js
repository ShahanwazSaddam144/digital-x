"use client";

import React, { useState, useRef, useEffect } from "react";

export default function GetQuoteModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "Web Design",
    budget: "$1k - $3k",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.service) e.service = "Select a service";
    if (!form.message.trim()) e.message = "Tell us briefly about your project";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    setLoading(true);
    try {
      const payload = new FormData();
      // Use FormData so file upload is supported; backend can accept multipart or you can send JSON.
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      if (file) payload.append("file", file);

      const res = await fetch("/api/quote", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Server error");
      }

      setSent(true);
      setForm({
        name: "",
        email: "",
        company: "",
        service: "Web Design",
        budget: "$1k - $3k",
        message: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating CTA Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Get a free quote"
        className="fixed right-6 bottom-6 z-50 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6M9 3h6a2 2 0 012 2v12a2 2 0 01-2 2H9m0-14v14" />
        </svg>
        Get a Free Quote
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Get a Free Quote</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {sent ? (
                <div className="text-center py-8">
                  <h4 className="text-2xl font-semibold text-green-600">Thanks — we received your request!</h4>
                  <p className="mt-3 text-gray-600">Our team will review your project and contact you within 1 business day.</p>
                  <button
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full"
                    onClick={() => {
                      setSent(false);
                      setOpen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-medium">Full name</label>
                    <input
                      ref={firstInputRef}
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"}`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"}`}
                      placeholder="you@company.com"
                      type="email"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-medium">Company (optional)</label>
                    <input
                      value={form.company}
                      onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                      className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-200 focus:ring-blue-200"
                      placeholder="Company name"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-medium">Service</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                      className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.service ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"}`}
                    >
                      <option>Web Design</option>
                      <option>SEO</option>
                      <option>Social Media</option>
                      <option>PPC / Ads</option>
                      <option>Branding</option>
                      <option>Custom Software / App</option>
                    </select>
                    {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Budget</label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}
                      className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-200 focus:ring-blue-200"
                    >
                      <option>$500 - $1k</option>
                      <option>$1k - $3k</option>
                      <option>$3k - $10k</option>
                      <option>$10k+</option>
                      <option>Not sure</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Project brief</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                      rows={4}
                      className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.message ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"}`}
                      placeholder="Describe your goals, timeline, or anything important..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Attachment (optional)</label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="mt-1 w-full text-sm text-gray-600"
                    />
                  </div>

                  {serverError && <p className="col-span-2 text-sm text-red-500">{serverError}</p>}

                  <div className="col-span-2 flex items-center justify-between gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-md border hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto bg-blue-600 text-white px-5 py-2 rounded-full font-semibold disabled:opacity-60 flex items-center gap-2"
                    >
                      {loading ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3" fill="none" />
                          <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                        </svg>
                      ) : (
                        "Send Request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="px-6 py-3 border-t text-sm text-gray-500">
              By submitting, you agree to be contacted about your project.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

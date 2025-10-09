'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';

export default function GetQuoteModal({ open = false, setOpen }) {
    const MAX_FILE_SIZE = 20 * 1024 * 1024;

    const [form, setForm] = useState({
        name: '',
        email: '',
        company: '',
        service: 'Web Design',
        budget: '$1k - $3k',
        message: '',
    });
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState('');
    const firstInputRef = useRef(null);

    // captcha + resolver
    const captchaRef = useRef(null);
    const captchaResolveRef = useRef(null);

    // cancellation + timers
    const abortControllerRef = useRef(null);
    const toastIdRef = useRef(null);
    const uploadTimerRef = useRef(null);
    const uploadStartRef = useRef(null);

    // store token optionally
    const [hcaptchaToken, setHcaptchaToken] = useState('');

    // focus the first input when modal opens
    useEffect(() => {
        if (open) setTimeout(() => firstInputRef.current?.focus(), 60);
    }, [open]);

    // escape to close modal
    useEffect(() => {
        if (!open) return;
        function onKey(e) {
            if (e.key === 'Escape') {
                cancelUploadAndClose();
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (uploadTimerRef.current) {
                clearInterval(uploadTimerRef.current);
                uploadTimerRef.current = null;
            }
            if (abortControllerRef.current) {
                try { abortControllerRef.current.abort(); } catch (e) { /* ignore */ }
                abortControllerRef.current = null;
            }
        };
    }, []);

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
        if (!form.service) e.service = 'Select a service';
        if (!form.message.trim()) e.message = 'Tell us briefly about your project';
        return e;
    }

    function handleFileChange(e) {
        const f = e.target.files?.[0] ?? null;
        if (!f) return setFile(null);
        if (f.size > MAX_FILE_SIZE) {
            setFile(null);
            toast.error(`File is too big — max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
            return;
        }
        setFile(f);
        toast.success(`File "${f.name}" selected`);
    }

    function startUploadToast() {
        toastIdRef.current = toast.loading('Sending request...', { duration: Infinity });
        uploadStartRef.current = Date.now();
        // update every second with fallback elapsed time
        uploadTimerRef.current = setInterval(() => {
            const elapsedSec = Math.floor((Date.now() - uploadStartRef.current) / 1000);
            if (!toastIdRef.current) return;
            if (elapsedSec < 6) toast.loading(`Uploading... ${elapsedSec}s`, { id: toastIdRef.current });
            else if (elapsedSec < 15) toast.loading(`Still uploading — ${elapsedSec}s (this might take a bit longer)`, { id: toastIdRef.current });
            else toast.loading(`Upload taking unusually long (${elapsedSec}s). You can cancel and retry.`, { id: toastIdRef.current });
        }, 1000);
    }

    function stopUploadToast(success = true, message = '') {
        if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
        }
        const id = toastIdRef.current;
        if (!id) return;
        if (success) toast.success(message || 'Request sent', { id });
        else toast.error(message || 'Upload failed', { id });
        toastIdRef.current = null;
        uploadStartRef.current = null;
        // auto dismiss after a while so UI isn't sticky
        setTimeout(() => toast.dismiss(id), 4000);
    }

    // Execute invisible captcha and wait for onVerify
    function executeCaptcha({ timeout = 20000 } = {}) {
        return new Promise((resolve, reject) => {
            if (!captchaRef.current) return reject(new Error('Captcha not ready'));

            // clear any previous resolver
            captchaResolveRef.current = null;

            // resolver that clears timeout
            const resolver = (token) => {
                clearTimeout(timer);
                captchaResolveRef.current = null;
                setHcaptchaToken(token);
                resolve(token);
            };

            captchaResolveRef.current = resolver;

            // try to execute
            try {
                // some versions of the lib return promise; we still depend on onVerify callback
                captchaRef.current.execute();
            } catch (err) {
                captchaResolveRef.current = null;
                return reject(new Error('Captcha execute failed'));
            }

            // timeout safety
            const timer = setTimeout(() => {
                if (captchaResolveRef.current) {
                    captchaResolveRef.current = null;
                    reject(new Error('Captcha timed out'));
                }
            }, timeout);
        });
    }

    // HCaptcha onVerify callback
    function onCaptchaVerify(token) {
        if (captchaResolveRef.current) {
            const resolver = captchaResolveRef.current;
            captchaResolveRef.current = null;
            resolver(token);
            return;
        }
        // fallback store
        setHcaptchaToken(token);
    }

    // Cancel in-flight upload / request and close modal
    function cancelUploadAndClose() {
        if (abortControllerRef.current) {
            try { abortControllerRef.current.abort(); } catch (e) { /* ignore */ }
            abortControllerRef.current = null;
            stopUploadToast(false, 'Upload canceled');
        }
        setLoading(false);
        setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError('');
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length) return;

        if (file && file.size > MAX_FILE_SIZE) {
            toast.error(`File too large — max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
            return;
        }

        setLoading(true);

        try {
            // run captcha
            const token = await executeCaptcha().catch((err) => { throw err; });
            if (!token) throw new Error('Captcha verification failed');

            // build payload
            const payload = new FormData();
            Object.entries(form).forEach(([k, v]) => payload.append(k, v));
            if (file) payload.append('file', file);
            payload.append('hcaptchaToken', token);

            // start UI
            startUploadToast();

            // create abort controller for axios
            abortControllerRef.current = new AbortController();

            // axios upload with progress + signal
            const res = await axios.post('/api/quote', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: abortControllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    if (!toastIdRef.current) return;
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    toast.loading(`Uploading... ${percent}%`, { id: toastIdRef.current });
                },
                timeout: 120000, // 2 minutes fallback
            });

            // success / error handling
            if (res.status < 200 || res.status >= 300) {
                stopUploadToast(false, res.data?.message || `Server error (${res.status})`);
                setServerError(res.data?.message || `Server error (${res.status})`);
                return;
            }

            stopUploadToast(true, 'Quote request sent successfully!');
            setSent(true);
            setForm({ name: '', email: '', company: '', service: 'Web Design', budget: '$1k - $3k', message: '' });
            setFile(null);
            setHcaptchaToken('');
            try { captchaRef.current?.resetCaptcha?.(); } catch (e) { /* ignore */ }
        } catch (err) {
            // detect abort/cancel
            const isCanceled =
                (axios.isCancel && axios.isCancel(err)) ||
                err?.name === 'CanceledError' ||
                err?.code === 'ERR_CANCELED' ||
                err?.message?.toLowerCase?.().includes('canceled') ||
                err?.message?.toLowerCase?.().includes('abort');

            if (isCanceled) {
                console.log('Upload canceled by user');
                stopUploadToast(false, 'Upload canceled');
            } else {
                console.error('Submit error:', err);
                stopUploadToast(false, err?.message || 'Something went wrong');
                setServerError(err?.message || 'Something went wrong');
            }
        } finally {
            // cleanup controller
            if (abortControllerRef.current) {
                abortControllerRef.current = null;
            }
            setLoading(false);
        }
    }

    // motion variants
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const panelVariants = { hidden: { opacity: 0, y: 60, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 60, scale: 0.98 } };

    return (
        <>
            <Toaster position="top-right" />

            {/* Floating CTA Button */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Get a free quote"
                className="fixed right-6 bottom-6 z-50 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6M9 3h6a2 2 0 012 2v12a2 2 0 01-2 2H9m0-14v14" /></svg>
                Get a Free Quote
            </button>

            <AnimatePresence mode="wait">
                {open && (
                    <motion.div
                        key="modal"
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                    >
                        {/* Overlay */}
                        <motion.div
                            key="overlay"
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => cancelUploadAndClose()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        />

                        {/* Panel */}
                        <motion.div
                            key="panel"
                            className="relative w-full md:max-w-3xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden md:mx-4"
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                            style={{ maxHeight: '90vh' }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b">
                                <h3 className="text-lg font-semibold">Get a Free Quote</h3>
                                <button
                                    onClick={() => cancelUploadAndClose()}
                                    aria-label="Close"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 128px)' }}>
                                {sent ? (
                                    <div className="text-center py-8">
                                        <h4 className="text-2xl font-semibold text-green-600">Thanks — we received your request!</h4>
                                        <p className="mt-3 text-gray-600">Our team will review your project and contact you within 1 business day.</p>
                                        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full" onClick={() => { setSent(false); setOpen(false); }}>Close</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium">Full name</label>
                                            <input
                                                ref={firstInputRef}
                                                value={form.name}
                                                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                                                className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                                                placeholder="Your name"
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium">Email</label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                                                className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                        </div>

                                        {/* Company */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium">Company</label>
                                            <input
                                                value={form.company}
                                                onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                                                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                placeholder="Your company (optional)"
                                            />
                                        </div>

                                        {/* Service */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium">Service</label>
                                            <select
                                                value={form.service}
                                                onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                                                className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.service ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                                            >
                                                <option>Web Design</option>
                                                <option>Branding</option>
                                                <option>SEO Optimization</option>
                                                <option>Social Media Marketing</option>
                                                <option>Paid Advertising</option>
                                                <option>Other</option>
                                            </select>
                                            {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                                        </div>

                                        {/* Budget */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium">Budget</label>
                                            <select
                                                value={form.budget}
                                                onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}
                                                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            >
                                                <option>$500 - $1k</option>
                                                <option>$1k - $3k</option>
                                                <option>$3k - $10k</option>
                                                <option>$10k+</option>
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium">Message</label>
                                            <textarea
                                                value={form.message}
                                                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                                                className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 min-h-[120px] ${errors.message ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                                                placeholder="Describe your project, goals, or any special requirements..."
                                            />
                                            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                        </div>

                                        {/* Attachment */}
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium">Attachment (optional)</label>
                                            <input type="file" onChange={handleFileChange} className="mt-1 w-full text-sm text-gray-600" />
                                            <p className="text-xs text-gray-400 mt-1">Max {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB</p>
                                        </div>

                                        {serverError && <p className="col-span-2 text-sm text-red-500">{serverError}</p>}

                                        {/* Invisible HCaptcha */}
                                        <HCaptcha
                                            ref={captchaRef}
                                            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                                            size="invisible"
                                            onVerify={onCaptchaVerify}
                                        />

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center justify-between gap-4 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (abortControllerRef.current) {
                                                        try { abortControllerRef.current.abort(); } catch (e) { /* ignore */ }
                                                        abortControllerRef.current = null;
                                                        stopUploadToast(false, 'Upload canceled');
                                                    }
                                                    setOpen(false);
                                                    setLoading(false);
                                                }}
                                                className="px-4 py-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>

                                            <button type="submit" disabled={loading} className="ml-auto bg-blue-600 text-white px-5 py-2 rounded-full font-semibold disabled:opacity-60 flex items-center gap-2">
                                                {loading ? (
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3" fill="none" />
                                                        <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                                                    </svg>
                                                ) : 'Send Request'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            <div className="px-6 py-3 border-t text-sm text-gray-500">By submitting, you agree to be contacted about your project.</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';
const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), { ssr: false });

export default function GetQuoteModal({ open = false, setOpen }) {
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    const CAPTCHA_TIMEOUT_MS = 60_000;

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

    // CAPTCHA
    const captchaRef = useRef(null);
    const captchaResolveRef = useRef(null);
    const captchaRejectRef = useRef(null);
    const captchaTimerRef = useRef(null);
    const [captchaReady, setCaptchaReady] = useState(false);
    const [captchaExecuting, setCaptchaExecuting] = useState(false);
    const [captchaError, setCaptchaError] = useState('');
    // increment this key to force remounting the HCaptcha component
    const [captchaKey, setCaptchaKey] = useState(0);

    const abortControllerRef = useRef(null);
    const toastIdRef = useRef(null);
    const uploadTimerRef = useRef(null);
    const uploadStartRef = useRef(null);

    const [hcaptchaToken, setHcaptchaToken] = useState('');

    // sitekey MUST be exposed as NEXT_PUBLIC_...
    const SITEKEY = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || '') : '';

    useEffect(() => {
        if (open) setTimeout(() => firstInputRef.current?.focus(), 60);
    }, [open]);

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

    useEffect(() => {
        return () => {
            if (uploadTimerRef.current) {
                clearInterval(uploadTimerRef.current);
                uploadTimerRef.current = null;
            }
            if (captchaTimerRef.current) {
                clearTimeout(captchaTimerRef.current);
                captchaTimerRef.current = null;
            }
            cancelCaptchaExecution();
            if (abortControllerRef.current) {
                try { abortControllerRef.current.abort(); } catch (e) { }
                abortControllerRef.current = null;
            }
        };
    }, []);

    // Watch the captchaRef and set ready if execute is present
    useEffect(() => {
        const el = captchaRef.current;
        if (el && typeof el.execute === 'function') {
            setCaptchaReady(true);
            setCaptchaError('');
            console.debug('hCaptcha ready via ref ✅');
        } else {
            setCaptchaReady(false);
        }
    }, [captchaKey]); // re-run when we remount the captcha

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

        setTimeout(() => toast.dismiss(id), 4000);
    }

    function cancelCaptchaExecution() {
        if (captchaExecuting) {
            setCaptchaExecuting(false);
        }
        if (captchaTimerRef.current) {
            clearTimeout(captchaTimerRef.current);
            captchaTimerRef.current = null;
        }
        if (captchaResolveRef.current || captchaRejectRef.current) {
            try {
                if (captchaRejectRef.current) {
                    captchaRejectRef.current(new Error('Captcha canceled by user'));
                }
            } catch (e) { }
            captchaResolveRef.current = null;
            captchaRejectRef.current = null;
        }
        try { captchaRef.current?.resetCaptcha?.(); } catch (e) { console.debug('resetCaptcha failed', e); }
        setCaptchaError('Captcha canceled — you can retry.');
    }

    // simpler wait that checks ref.execute and captchaReady
    function waitForCaptchaReady(waitMs = 10000, interval = 200) {
        return new Promise((resolve, reject) => {
            if (!SITEKEY) return reject(new Error('hCaptcha site key missing (NEXT_PUBLIC_HCAPTCHA_SITEKEY)'));
            if (captchaReady && captchaRef.current?.execute) return resolve(true);
            let elapsed = 0;
            const t = setInterval(() => {
                elapsed += interval;
                if (captchaRef.current?.execute) {
                    clearInterval(t);
                    setCaptchaReady(true);
                    return resolve(true);
                }
                if (elapsed >= waitMs) {
                    clearInterval(t);
                    return reject(new Error('Captcha failed to initialize in time'));
                }
            }, interval);
        });
    }

    async function executeCaptcha({ timeout = CAPTCHA_TIMEOUT_MS } = {}) {
        return new Promise(async (resolve, reject) => {
            if (!SITEKEY) {
                toast.error('Captcha site key is not configured. Contact admin.');
                return reject(new Error('hCaptcha site key missing'));
            }

            try {
                await waitForCaptchaReady(10000);
            } catch (err) {
                // try a single remount as a last ditch
                console.warn('waitForCaptchaReady failed:', err?.message);
                setCaptchaError('Captcha failed to initialize. Attempting to reinitialize...');
                // remount captcha to try to recover from transient failure
                setTimeout(() => setCaptchaKey(k => k + 1), 150);
                try {
                    await waitForCaptchaReady(10000);
                } catch (err2) {
                    toast.error('Captcha failed to initialize. Please try "Verify Captcha" or reload the page.');
                    setCaptchaError('Captcha failed to initialize — please reload or try again.');
                    return reject(err2);
                }
            }

            if (captchaExecuting) return reject(new Error('Captcha already executing'));

            setCaptchaError('');
            setCaptchaExecuting(true);

            captchaResolveRef.current = null;
            captchaRejectRef.current = null;

            let remainingTime = timeout;
            let timer = null;
            let lastTick = Date.now();
            let paused = false;

            const startTimer = () => {
                lastTick = Date.now();
                timer = setTimeout(() => {
                    if (captchaRejectRef.current) {
                        captchaRejectRef.current(new Error('Captcha timed out — please try again.'));
                        return;
                    }
                    captchaResolveRef.current = null;
                    cleanup();
                    reject(new Error('Captcha timed out — please try again.'));
                }, remainingTime);
            };

            const pauseTimer = () => {
                if (!timer) return;
                clearTimeout(timer);
                timer = null;
                const elapsed = Date.now() - lastTick;
                remainingTime = Math.max(0, remainingTime - elapsed);
                paused = true;
            };

            const resumeTimer = () => {
                if (paused && !timer) {
                    paused = false;
                    startTimer();
                }
            };

            const onFocus = () => pauseTimer();
            const onBlur = () => resumeTimer();

            window.addEventListener('focusin', onFocus);
            window.addEventListener('focusout', onBlur);

            const cleanup = () => {
                clearTimeout(timer);
                timer = null;
                window.removeEventListener('focusin', onFocus);
                window.removeEventListener('focusout', onBlur);
                paused = false;
                setCaptchaExecuting(false);
                captchaResolveRef.current = null;
                captchaRejectRef.current = null;
            };

            captchaResolveRef.current = (token) => {
                cleanup();
                setHcaptchaToken(token);
                resolve(token);
            };
            captchaRejectRef.current = (err) => {
                cleanup();
                setHcaptchaToken('');
                setCaptchaError(err?.message || 'Captcha canceled');
                reject(err);
            };

            let attempts = 0;
            const maxAttempts = 3;
            const tryExecute = () => {
                attempts += 1;
                try {
                    // use optional chaining to avoid crashing if ref shape differs
                    const exec = captchaRef.current?.execute;
                    if (typeof exec === 'function') {
                        exec.call(captchaRef.current);
                        toast.loading('Please complete the hCaptcha challenge...', { id: 'captcha-wait', duration: 4000 });
                        startTimer();
                    } else {
                        throw new Error('Captcha execute method not available');
                    }
                } catch (err) {
                    console.warn('Captcha execute error', err);
                    if (attempts < maxAttempts) {
                        setTimeout(tryExecute, 300);
                        return;
                    } else {
                        if (captchaRejectRef.current) {
                            captchaRejectRef.current(new Error('Captcha execution failed: ' + (err?.message || 'unknown')));
                        } else {
                            cleanup();
                            reject(new Error('Captcha execution failed'));
                        }
                    }
                }
            };

            tryExecute();
        });
    }

    function onCaptchaVerify(token) {
        if (captchaResolveRef.current) {
            const resolver = captchaResolveRef.current;
            captchaResolveRef.current = null;
            captchaRejectRef.current = null;
            resolver(token);
            return;
        }
        setHcaptchaToken(token);
        setCaptchaExecuting(false);
    }

    function onCaptchaLoad() {
        setCaptchaReady(true);
        setCaptchaError('');
        console.debug('hCaptcha loaded ✅');
    }

    function onCaptchaError(err) {
        console.error('hCaptcha error ❌', err);
        setCaptchaError('Captcha failed to load — please try again.');
        setCaptchaReady(false);
        // force a remount to attempt recovery
        setTimeout(() => setCaptchaKey(k => k + 1), 250);
        if (captchaRejectRef.current) {
            try { captchaRejectRef.current(new Error('Captcha error')); } catch (e) { }
        }
        setCaptchaExecuting(false);
    }

    function cancelUploadAndClose() {
        if (abortControllerRef.current) {
            try { abortControllerRef.current.abort(); } catch (e) { }
            abortControllerRef.current = null;
            stopUploadToast(false, 'Upload canceled');
        }

        if (captchaExecuting) {
            cancelCaptchaExecution();
            toast('Captcha canceled', { icon: '⚠️' });
            setLoading(false);
            return;
        }

        setLoading(false);
        setOpen(false);
    }

    async function handleCancelButton() {
        if (abortControllerRef.current) {
            try { abortControllerRef.current.abort(); } catch (e) { console.error(e); }
            abortControllerRef.current = null;
            stopUploadToast(false, 'Upload canceled');
            setLoading(false);
            setOpen(false);
            return;
        }

        if (captchaExecuting) {
            cancelCaptchaExecution();
            toast('Cancelled captcha — you can retry.', { icon: '✖️' });
            setLoading(false);
            return;
        }

        setOpen(false);
        setLoading(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError('');
        setCaptchaError('');
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length) return;

        if (!SITEKEY) {
            setCaptchaError('Captcha site key missing. Contact admin.');
            toast.error('Captcha is not configured on this site.');
            return;
        }

        if (file && file.size > MAX_FILE_SIZE) {
            toast.error(`File too large — max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
            return;
        }

        setLoading(true);

        try {
            const token = await executeCaptcha().catch((err) => { throw err; });
            if (!token) throw new Error('Captcha verification failed');

            const payload = new FormData();
            Object.entries(form).forEach(([k, v]) => payload.append(k, v));
            if (file) payload.append('file', file);
            payload.append('hcaptchaToken', token);

            startUploadToast();

            abortControllerRef.current = new AbortController();

            const res = await axios.post('/api/quote', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: abortControllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    if (!toastIdRef.current) return;
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    toast.loading(`Uploading... ${percent}%`, { id: toastIdRef.current });
                },
                timeout: 120000,
            });

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
            try { captchaRef.current?.resetCaptcha?.(); } catch (e) { }
        } catch (err) {
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

                if (err?.message?.toLowerCase?.().includes('captcha')) {
                    setCaptchaError(err.message);
                    cancelCaptchaExecution();
                }
            }
        } finally {
            if (abortControllerRef.current) {
                abortControllerRef.current = null;
            }
            setLoading(false);
        }
    }

    async function handleManualCaptcha() {
        setServerError('');
        setCaptchaError('');
        if (!SITEKEY) {
            toast.error('Captcha site key is missing — cannot run captcha.');
            setCaptchaError('Captcha site key missing.');
            return;
        }
        try {
            toast.loading('Starting captcha...', { id: 'manual-captcha', duration: Infinity });
            const token = await executeCaptcha();
            toast.dismiss('manual-captcha');
            toast.success('Captcha completed — you can now submit the form.');
            console.log('manual captcha token', token);
        } catch (err) {
            toast.dismiss('manual-captcha');
            toast.error(err?.message || 'Captcha failed');
            setCaptchaError(err?.message || 'Captcha failed');
        }
    }

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const panelVariants = { hidden: { opacity: 0, y: 60, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 60, scale: 0.98 } };

    return (
        <>
            <Toaster position="top-right" />

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
                        <motion.div
                            key="overlay"
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => {
                                if (captchaExecuting) {
                                    cancelCaptchaExecution();
                                    toast('Captcha canceled — you can try again.', { icon: '⚠️' });
                                    return;
                                }
                                if (abortControllerRef.current) {
                                    try { abortControllerRef.current.abort(); } catch (e) { }
                                    abortControllerRef.current = null;
                                    stopUploadToast(false, 'Upload canceled');
                                    setLoading(false);
                                    setOpen(false);
                                    return;
                                }
                                cancelUploadAndClose();
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        />

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

                            <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 128px)' }}>
                                {sent ? (
                                    <div className="text-center py-8">
                                        <h4 className="text-2xl font-semibold text-green-600">Thanks — we received your request!</h4>
                                        <p className="mt-3 text-gray-600">Our team will review your project and contact you within 1 business day.</p>
                                        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full" onClick={() => { setSent(false); setOpen(false); }}>Close</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* ... form fields unchanged (kept from your original code) ... */}
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

                                        {/* ... rest of inputs omitted from this snippet for brevity (keep your original JSX) ... */}

                                        {/* IMPORTANT: render the HCaptcha component but only on client and with a remount key */}
                                        <div className="col-span-2">
                                            {!SITEKEY ? (
                                                <p className="text-sm text-red-500">Captcha not configured (NEXT_PUBLIC_HCAPTCHA_SITEKEY missing).</p>
                                            ) : (
                                                <HCaptcha
                                                    key={`hc-${captchaKey}`}
                                                    ref={(el) => {
                                                        captchaRef.current = el;
                                                        // if element exposes execute, mark ready
                                                        if (el && typeof el.execute === 'function') {
                                                            setCaptchaReady(true);
                                                            setCaptchaError('');
                                                        }
                                                    }}
                                                    sitekey={SITEKEY}
                                                    size="invisible"
                                                    onVerify={onCaptchaVerify}
                                                    onLoad={onCaptchaLoad}
                                                    onError={onCaptchaError}
                                                />
                                            )}

                                            {captchaReady ? (
                                                <p className="text-xs text-gray-500 mt-2">Captcha ready ✅</p>
                                            ) : (
                                                <p className="text-xs text-yellow-600 mt-2">Captcha loading… please wait</p>
                                            )}

                                            {captchaExecuting && (
                                                <p className="text-xs text-blue-600 mt-1">Captcha in progress — click outside to cancel it or press Cancel ✖️</p>
                                            )}

                                            {captchaError && <p className="text-sm text-red-500 mt-1">{captchaError}</p>}

                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // force remount captcha if it's stuck
                                                        setCaptchaKey(k => k + 1);
                                                        toast('Reinitializing captcha...', { icon: '🔁' });
                                                    }}
                                                    className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                                                >
                                                    Reinitialize Captcha
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleManualCaptcha}
                                                    disabled={captchaExecuting || loading}
                                                    className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                                                >
                                                    {captchaExecuting ? 'Captcha running...' : 'Verify Captcha'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-between gap-4 mt-2">
                                            <button
                                                type="button"
                                                onClick={handleCancelButton}
                                                className="px-4 py-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                                                disabled={false}
                                            >
                                                Cancel
                                            </button>

                                            <div className="ml-auto flex items-center gap-3">
                                                <button type="submit" disabled={loading || captchaExecuting} className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold disabled:opacity-60 flex items-center gap-2">
                                                    {loading ? (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3" fill="none" />
                                                            <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                                                        </svg>
                                                    ) : 'Send Request'}
                                                </button>
                                            </div>
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

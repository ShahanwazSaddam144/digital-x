"use client";

import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export const captchaRef = { current: null }; 

export default function HCaptchaProvider() {
    const [token, setToken] = useState("");

    return (
        <HCaptcha
            ref={(el) => (captchaRef.current = el)}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
            size="invisible"
            onVerify={(tok) => setToken(tok)}
        />
    );
}

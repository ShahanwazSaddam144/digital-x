import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();

    const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET,
        response: token,
      }),
    });

    const data = await verifyRes.json();

    if (!data.success) {
      return NextResponse.json({ ok: false, message: "Invalid captcha" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Captcha verification failed" }, { status: 500 });
  }
}

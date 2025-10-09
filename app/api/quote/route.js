// app/api/quote/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "../../lib/mongodb";

export async function POST(req) {
    try {

        const contentType = req.headers.get("content-type") || "";

        let payload = {};
        let fileAttachment = null;

        if (contentType.includes("application/json")) {
            payload = await req.json();
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();

            // expected fields: name, email, company, service, budget, message
            payload = {
                name: formData.get("name") ?? "",
                email: formData.get("email") ?? "",
                company: formData.get("company") ?? "",
                service: formData.get("service") ?? "",
                budget: formData.get("budget") ?? "",
                message: formData.get("message") ?? "",
            };

            // file handling: 'file' is optional
            const file = formData.get("file");
            if (file && typeof file === "object" && "arrayBuffer" in file) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fileAttachment = {
                    filename: file.name || "attachment",
                    content: buffer,
                    contentType: file.type || "application/octet-stream",
                };
            }
        } else {
            // fallback
            try {
                payload = await req.json();
            } catch {
                return NextResponse.json({ ok: false, message: "Unsupported content-type" }, { status: 400 });
            }
        }

        // validate basic fields (adjust as needed)
        if (!payload.name || !payload.email || !payload.message) {
            return NextResponse.json({ ok: false, message: "name, email and message are required" }, { status: 400 });
        }

        // Save to MongoDB (without file binary)
        const { db } = await connectToDatabase();
        const quotes = db.collection("quotes");

        const record = {
            ...payload,
            fileMeta: fileAttachment
                ? { filename: fileAttachment.filename, contentType: fileAttachment.contentType, size: fileAttachment.content?.length ?? null }
                : null,
            createdAt: new Date(),
        };

        const insertResult = await quotes.insertOne(record);

        // Send email via Nodemailer (Gmail)
        // Make sure you set EMAIL_USER and EMAIL_PASS in env (app password)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailTo = process.env.EMAIL_TO || process.env.EMAIL_USER;
        const subject = `New Quote Request from ${payload.name}`;

        // build HTML body
        // prettier-ignore
        const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Quote Request</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
    <!-- preheader (hidden snippet shown in inbox preview) -->
    <span style="display:none;max-height:0;overflow:hidden;color:transparent;">
      New quote request from ${escapeHtml(payload.name)}
    </span>

    <table role="presentation" width="100%" style="max-width:800px;margin:0 auto;">
      <tr>
        <td align="center">
          <!-- Card -->
          <table role="presentation" width="100%" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#6366F1,#8B5CF6);padding:22px 24px;color:#fff;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:42px;height:42px;background:rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;">DX</div>
                  <div>
                    <h1 style="margin:0;font-size:18px;letter-spacing: -0.2px;">New Quote Request</h1>
                    <div style="font-size:13px;opacity:0.95;margin-top:3px;">From <strong>${escapeHtml(payload.name)}</strong></div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:20px 22px;">
                <table role="presentation" width="100%" style="border-collapse:collapse;">
                  <tbody>
                    <tr>
                      <td style="padding:10px 0;color:#6b7280;font-size:13px;width:45%"><strong>Name</strong></td>
                      <td style="padding:10px 0;text-align:right;color:#111827">${escapeHtml(payload.name)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#6b7280;font-size:13px"><strong>Email</strong></td>
                      <td style="padding:10px 0;text-align:right;color:#111827"><a href="mailto:${escapeHtml(payload.email)}" style="color:#111827;text-decoration:none;">${escapeHtml(payload.email)}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#6b7280;font-size:13px"><strong>Company</strong></td>
                      <td style="padding:10px 0;text-align:right;color:#111827">${escapeHtml(payload.company || '—')}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#6b7280;font-size:13px"><strong>Service</strong></td>
                      <td style="padding:10px 0;text-align:right;color:#111827">${escapeHtml(payload.service)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#6b7280;font-size:13px"><strong>Budget</strong></td>
                      <td style="padding:10px 0;text-align:right;color:#111827">${escapeHtml(payload.budget)}</td>
                    </tr>
                  </tbody>
                </table>

                <hr style="border:none;border-top:1px solid #eef2ff;margin:18px 0;" />

                <h3 style="margin:0 0 8px;font-size:15px;color:#111827">Project Brief</h3>
                <div style="font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.5;margin-bottom:12px;">
                  ${nl2br(escapeHtml(payload.message))}
                </div>

                ${fileAttachment ? `
                  <div style="margin-top:8px;padding:12px;border-radius:10px;background:#f8fafc;border:1px solid #eef2ff;font-size:13px;color:#111827;">
                    <strong>Attachment:</strong>
                    <div style="margin-top:6px;color:#374151;">
                      ${escapeHtml(fileAttachment.filename)} &middot; ${escapeHtml(fileAttachment.contentType || 'unknown')} &middot; ${fileAttachment.content?.length ?? '—'} bytes
                    </div>
                  </div>
                ` : ''}

                <div style="margin-top:18px;text-align:center;">
                  <a href="mailto:${process.env.EMAIL_TO || process.env.EMAIL_USER}" 
                     style="display:inline-block;background:#6366F1;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Reply / Contact
                  </a>
                </div>

                <p style="margin:18px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
                  Saved to DB: <code style="background:#f3f4f6;padding:4px 8px;border-radius:6px;color:#111827;">${insertResult.insertedId}</code>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#fafafa;padding:14px 18px;text-align:center;color:#9ca3af;font-size:12px;">
                By submitting this form, the sender agreed to be contacted about their project. &nbsp;•&nbsp; Digital-X
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

        // Plain-text fallback (keep it simple & readable)
        const text = [
            `New Quote Request from ${payload.name}`,
            `Email: ${payload.email}`,
            `Company: ${payload.company || '—'}`,
            `Service: ${payload.service}`,
            `Budget: ${payload.budget}`,
            '',
            'Message:',
            payload.message,
            '',
            `Saved to DB: ${insertResult.insertedId}`,
        ].join('\n\n');


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: mailTo,
            subject,
            html,
            attachments: fileAttachment ? [
                {
                    filename: fileAttachment.filename,
                    content: fileAttachment.content,
                    contentType: fileAttachment.contentType,
                },
            ] : [],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ ok: true, message: "Quote saved and email sent", id: insertResult.insertedId }, { status: 200 });
    } catch (err) {
        console.error("Quote API error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

// tiny helpers
function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
function nl2br(str) {
    return (str || "").replace(/\n/g, "<br/>");
}

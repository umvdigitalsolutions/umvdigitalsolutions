import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = process.env.CONTACT_TO_EMAIL;
const FROM = process.env.CONTACT_FROM_EMAIL;

export async function POST(request) {
  const { name, phone, email, service, budget, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const row = (label, value) =>
    value && value !== "Service Required" && value !== "Budget Range"
      ? `<tr>
           <td style="padding:10px 0;border-bottom:1px solid #1a2035;color:#6b7fa0;font-size:13px;width:110px;vertical-align:top;">${label}</td>
           <td style="padding:10px 0;border-bottom:1px solid #1a2035;color:#e4eeff;font-size:14px;font-weight:600;">${value}</td>
         </tr>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#03040a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#03040a;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <!-- Header bar -->
        <tr><td style="background:linear-gradient(90deg,#11b7ff,#8d4dff,#48ffb0);height:3px;border-radius:3px 3px 0 0;"></td></tr>

        <!-- Card -->
        <tr><td style="background:#080e1c;border:1px solid #1a2035;border-top:0;border-radius:0 0 16px 16px;padding:32px 28px;">

          <!-- Logo / brand line -->
          <p style="margin:0 0 6px;font-size:11px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#11b7ff;">UMV Digital Solutions</p>
          <h1 style="margin:0 0 24px;font-size:20px;font-weight:800;color:#f0f6ff;">New Enquiry Received</h1>

          <!-- Fields table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("Name", name)}
            ${row("Email", `<a href="mailto:${email}" style="color:#11b7ff;text-decoration:none;">${email}</a>`)}
            ${row("Phone", phone)}
            ${row("Service", service)}
            ${row("Budget", budget)}
          </table>

          <!-- Message block -->
          <div style="margin-top:20px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#6b7fa0;">Message</p>
            <div style="background:#0d1427;border:1px solid #1a2035;border-left:3px solid #48ffb0;border-radius:0 8px 8px 0;padding:16px 18px;">
              <p style="margin:0;color:#c8d8ec;font-size:14px;line-height:1.75;">${message.replace(/\n/g, "<br>")}</p>
            </div>
          </div>

          <!-- Reply CTA -->
          <div style="margin-top:28px;text-align:center;">
            <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#11b7ff,#48ffb0);border-radius:999px;color:#020309;font-size:14px;font-weight:800;text-decoration:none;">
              Reply to ${name} →
            </a>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#3a4a5e;">This message was sent via the contact form on umvdigitalsolutions.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: `UMV Website <${FROM}>`,
    to: TO,
    replyTo: email,
    subject: `New enquiry from ${name}${service && service !== "Service Required" ? ` — ${service}` : ""}`,
    html,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

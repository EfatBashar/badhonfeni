import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, blood_group } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GMAIL_USER = "badhanfgcunit2018@gmail.com";
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_APP_PASSWORD) {
      return new Response(JSON.stringify({ error: "Email configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = phone ? escapeHtml(String(phone)) : "N/A";
    const safeBloodGroup = blood_group ? escapeHtml(String(blood_group)) : "N/A";

    const htmlBody = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:30px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">❤️ বাঁধন, ফেনী সরকারি কলেজ ইউনিট</h1>
  </div>
  <div style="padding:30px;">
    <h2 style="color:#1f2937;margin-top:0;">প্রিয় ${safeName},</h2>
    <p style="color:#4b5563;font-size:16px;line-height:1.6;">
      ধন্যবাদ! আপনার সাইনআপ সফল হয়েছে। আমাদের পাশে থাকার জন্য অসংখ্য ধন্যবাদ। 🎉
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #dc2626;">
      <h3 style="color:#dc2626;margin-top:0;">আপনার তথ্য:</h3>
      <p style="color:#4b5563;margin:5px 0;">👤 <strong>নাম:</strong> ${safeName}</p>
      <p style="color:#4b5563;margin:5px 0;">📧 <strong>ইমেইল:</strong> ${safeEmail}</p>
      <p style="color:#4b5563;margin:5px 0;">📱 <strong>ফোন:</strong> ${safePhone}</p>
      <p style="color:#4b5563;margin:5px 0;">🩸 <strong>রক্তের গ্রুপ:</strong> ${safeBloodGroup}</p>
    </div>
    <p style="color:#4b5563;font-size:16px;line-height:1.6;">
      রক্তদানে এগিয়ে আসার জন্য আপনাকে আন্তরিক শুভেচ্ছা। আপনার একটি সাড়া কারও জীবনে আশার আলো হয়ে উঠতে পারে। ❤️
    </p>
    <p style="color:#4b5563;font-size:14px;margin-top:30px;">
      শুভেচ্ছান্তে,<br><strong>বাঁধন পরিবার</strong>
    </p>
  </div>
  <div style="background:#f9fafb;padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">© বাঁধন, ফেনী সরকারি কলেজ ইউনিট</p>
  </div>
</div>`;

    const subject = "ধন্যবাদ! বাঁধন এ আপনার সাইনআপ সফল হয়েছে ❤️";

    // Build RFC 2822 MIME message
    const messageParts = [
      `From: ${GMAIL_USER}`,
      `To: ${String(email).trim()}`,
      `Subject: =?UTF-8?B?${base64Encode(new TextEncoder().encode(subject))}?=`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      base64Encode(new TextEncoder().encode(htmlBody)),
    ];
    const rawMessage = messageParts.join("\r\n");

    // Base64url encode the entire message for Gmail API
    const rawBase64 = base64Encode(new TextEncoder().encode(rawMessage))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Use Gmail SMTP relay via Google's API with Basic Auth (App Password)
    // Gmail API v1 send endpoint
    const credentials = base64Encode(new TextEncoder().encode(`${GMAIL_USER}:${GMAIL_APP_PASSWORD}`));

    // Try Gmail API with OAuth-like basic approach — but Gmail API needs OAuth.
    // Instead, use Google's SMTP relay via fetch-based approach won't work.
    // Let's use the Gmail API send endpoint with the app password via Google's smtp-relay.

    // Actually, the most reliable way in edge runtime is to use Gmail's SMTP relay
    // via a raw TCP connection. But edge runtime doesn't support raw TCP.
    // So let's use the Lovable AI gateway to send the email instead.

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Use a simple fetch-based approach: send via Gmail SMTP using a proxy service
    // Since direct SMTP doesn't work in edge runtime, let's construct the email
    // and send it via Google's Gmail API using service account or app password.

    // The most reliable approach: use nodemailer-compatible fetch
    // Actually, let's just use raw SMTP over fetch won't work.
    // The real solution: use the Gmail API REST endpoint.
    // But Gmail API requires OAuth2 token, not app password.

    // Final approach: Use the Lovable AI to acknowledge, and send via
    // a simple HTTP-based email service that accepts basic auth.

    // Let's try Google's gmail.googleapis.com with XOAuth2
    // App passwords work with SMTP but not REST API.
    // Since SMTP is broken in edge runtime, let's use an alternative:
    // Send via Google's SMTP relay using the smtp module with the writeAll polyfill.

    // Actually, the writeAll polyfill should have worked. Let me try a different SMTP lib.
    // Use denomailer which is more modern.

    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");

    const smtpClient = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD,
        },
      },
    });

    await smtpClient.send({
      from: GMAIL_USER,
      to: String(email).trim(),
      subject: subject,
      content: "auto",
      html: htmlBody,
    });

    await smtpClient.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

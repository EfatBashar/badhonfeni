import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, blood_group } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "name and email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GMAIL_USER = "badhanfgcunit2018@gmail.com";
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_APP_PASSWORD) {
      return new Response(JSON.stringify({ error: "Email config missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sName = esc(String(name));
    const sEmail = esc(String(email));
    const sPhone = phone ? esc(String(phone)) : "N/A";
    const sBG = blood_group ? esc(String(blood_group)) : "N/A";

    const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:30px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">❤️ বাঁধন, ফেনী সরকারি কলেজ ইউনিট</h1>
  </div>
  <div style="padding:30px;">
    <h2 style="color:#1f2937;margin-top:0;">প্রিয় ${sName},</h2>
    <p style="color:#4b5563;font-size:16px;line-height:1.6;">ধন্যবাদ! আপনার সাইনআপ সফল হয়েছে। আমাদের পাশে থাকার জন্য অসংখ্য ধন্যবাদ। 🎉</p>
    <div style="background:#fef2f2;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #dc2626;">
      <h3 style="color:#dc2626;margin-top:0;">আপনার তথ্য:</h3>
      <p style="color:#4b5563;margin:5px 0;">👤 <strong>নাম:</strong> ${sName}</p>
      <p style="color:#4b5563;margin:5px 0;">📧 <strong>ইমেইল:</strong> ${sEmail}</p>
      <p style="color:#4b5563;margin:5px 0;">📱 <strong>ফোন:</strong> ${sPhone}</p>
      <p style="color:#4b5563;margin:5px 0;">🩸 <strong>রক্তের গ্রুপ:</strong> ${sBG}</p>
    </div>
    <p style="color:#4b5563;font-size:16px;line-height:1.6;">রক্তদানে এগিয়ে আসার জন্য আপনাকে আন্তরিক শুভেচ্ছা। আপনার একটি সাড়া কারও জীবনে আশার আলো হয়ে উঠতে পারে। ❤️</p>
    <p style="color:#4b5563;font-size:14px;margin-top:30px;">শুভেচ্ছান্তে,<br><strong>বাঁধন পরিবার</strong></p>
  </div>
  <div style="background:#f9fafb;padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">© বাঁধন, ফেনী সরকারি কলেজ ইউনিট</p>
  </div>
</div>`;

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD.replace(/\s/g, ""),
        },
      },
    });

    await client.send({
      from: GMAIL_USER,
      to: String(email).trim(),
      subject: "ধন্যবাদ! বাঁধন এ আপনার সাইনআপ সফল হয়েছে ❤️",
      content: "auto",
      html: html,
    });

    await client.close();

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

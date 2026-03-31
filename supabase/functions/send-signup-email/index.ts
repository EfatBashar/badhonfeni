import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, blood_group } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GMAIL_USER = "badhanfgcunit2018@gmail.com";
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_APP_PASSWORD) {
      console.error("GMAIL_APP_PASSWORD not set");
      return new Response(
        JSON.stringify({ error: "Email configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_APP_PASSWORD,
    });

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">❤️ বাঁধন, ফেনী সরকারি কলেজ ইউনিট</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; margin-top: 0;">প্রিয় ${name},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            আপনি সফলভাবে <strong>বাঁধন, ফেনী সরকারি কলেজ ইউনিট</strong> এ সাইনআপ করেছেন। আপনাকে স্বাগতম! 🎉
          </p>
          <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">আপনার তথ্য:</h3>
            <p style="color: #4b5563; margin: 5px 0;">👤 <strong>নাম:</strong> ${name}</p>
            <p style="color: #4b5563; margin: 5px 0;">📧 <strong>ইমেইল:</strong> ${email}</p>
            <p style="color: #4b5563; margin: 5px 0;">📱 <strong>ফোন:</strong> ${phone || "N/A"}</p>
            <p style="color: #4b5563; margin: 5px 0;">🩸 <strong>রক্তের গ্রুপ:</strong> ${blood_group || "N/A"}</p>
          </div>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            রক্তদানে এগিয়ে আসার জন্য আপনাকে অসংখ্য ধন্যবাদ। আপনার একটি পদক্ষেপ কারো জীবন বাঁচাতে পারে। 🙏
          </p>
          <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">
            শুভেচ্ছান্তে,<br>
            <strong>বাঁধন পরিবার</strong>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© বাঁধন, ফেনী সরকারি কলেজ ইউনিট</p>
        </div>
      </div>
    `;

    await client.send({
      from: GMAIL_USER,
      to: email,
      subject: "স্বাগতম! বাঁধন, ফেনী সরকারি কলেজ ইউনিট এ আপনার সাইনআপ সফল হয়েছে ❤️",
      content: "text/html",
      html: htmlBody,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

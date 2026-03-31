import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type LegacyDeno = typeof Deno & {
  writeAll?: (writer: { write: (data: Uint8Array) => Promise<number> }, data: Uint8Array) => Promise<void>;
};

const denoWithWriteAll = Deno as LegacyDeno;
if (!denoWithWriteAll.writeAll) {
  denoWithWriteAll.writeAll = async (writer, data) => {
    let written = 0;
    while (written < data.length) {
      written += await writer.write(data.subarray(written));
    }
  };
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const client = new SmtpClient();

  try {
    const { name, email, phone, blood_group } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = phone ? escapeHtml(String(phone)) : "N/A";
    const safeBloodGroup = blood_group ? escapeHtml(String(blood_group)) : "N/A";

    const GMAIL_USER = "badhanfgcunit2018@gmail.com";
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_APP_PASSWORD) {
      console.error("GMAIL_APP_PASSWORD not set");
      return new Response(
        JSON.stringify({ error: "Email configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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
          <h2 style="color: #1f2937; margin-top: 0;">প্রিয় ${safeName},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            ধন্যবাদ! আপনার সাইনআপ সফল হয়েছে। আমাদের পাশে থাকার জন্য অসংখ্য ধন্যবাদ। 🎉
          </p>
          <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">আপনার তথ্য:</h3>
            <p style="color: #4b5563; margin: 5px 0;">👤 <strong>নাম:</strong> ${safeName}</p>
            <p style="color: #4b5563; margin: 5px 0;">📧 <strong>ইমেইল:</strong> ${safeEmail}</p>
            <p style="color: #4b5563; margin: 5px 0;">📱 <strong>ফোন:</strong> ${safePhone}</p>
            <p style="color: #4b5563; margin: 5px 0;">🩸 <strong>রক্তের গ্রুপ:</strong> ${safeBloodGroup}</p>
          </div>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            রক্তদানে এগিয়ে আসার জন্য আপনাকে আন্তরিক শুভেচ্ছা। আপনার একটি সাড়া কারও জীবনে আশার আলো হয়ে উঠতে পারে। ❤️
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
      to: safeEmail,
      subject: "ধন্যবাদ! বাঁধন, ফেনী সরকারি কলেজ ইউনিট এ আপনার সাইনআপ সফল হয়েছে ❤️",
      content: "text/html",
      html: htmlBody,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } finally {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
  }
});

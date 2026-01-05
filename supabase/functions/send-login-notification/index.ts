import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LoginNotificationRequest {
  email: string;
  loginTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, loginTime }: LoginNotificationRequest = await req.json();

    console.log(`Sending login notification for ${email} at ${loginTime}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Astro Dashboard <onboarding@resend.dev>",
        to: ["trajkovicisaak@gmail.com"],
        subject: "Nova prijava na Astro Dashboard",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8b5cf6; text-align: center;">🔐 Nova Prijava na Dashboard</h1>
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px; color: #fff;">
              <p style="font-size: 16px; margin-bottom: 15px;">
                <strong>Korisnik:</strong> ${email}
              </p>
              <p style="font-size: 16px; margin-bottom: 15px;">
                <strong>Vreme prijave:</strong> ${loginTime}
              </p>
            </div>
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
              Ova notifikacija je automatski generisana od strane Astro Dashboard sistema.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-login-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

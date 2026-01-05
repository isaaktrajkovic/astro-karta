import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  customerName: string;
  email: string;
  productName: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  note?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-order-notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderNotificationRequest = await req.json();
    console.log("Order data received:", orderData);

    // Send notification to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Astro Portal <onboarding@resend.dev>",
        to: ["trajkovicisaak@gmail.com"],
        subject: `Nova narudžbina: ${orderData.productName}`,
        html: `
          <h1>Nova narudžbina primljena!</h1>
          <h2>Detalji narudžbine:</h2>
          <ul>
            <li><strong>Proizvod:</strong> ${orderData.productName}</li>
            <li><strong>Ime kupca:</strong> ${orderData.customerName}</li>
            <li><strong>Email:</strong> ${orderData.email}</li>
            <li><strong>Datum rođenja:</strong> ${orderData.birthDate}</li>
            <li><strong>Vreme rođenja:</strong> ${orderData.birthTime || 'Nije navedeno'}</li>
            <li><strong>Mesto rođenja:</strong> ${orderData.birthPlace}</li>
            ${orderData.note ? `<li><strong>Napomena:</strong> ${orderData.note}</li>` : ''}
          </ul>
          <p>Posetite dashboard za više detalja.</p>
        `,
      }),
    });

    console.log("Admin email sent:", adminEmailResponse.status);

    // Send confirmation to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Astro Portal <onboarding@resend.dev>",
        to: [orderData.email],
        subject: `Vaša narudžbina je primljena - ${orderData.productName}`,
        html: `
          <h1>Hvala vam na narudžbini, ${orderData.customerName}!</h1>
          <p>Vaša narudžbina za <strong>${orderData.productName}</strong> je uspešno primljena.</p>
          <h2>Detalji:</h2>
          <ul>
            <li><strong>Datum rođenja:</strong> ${orderData.birthDate}</li>
            <li><strong>Vreme rođenja:</strong> ${orderData.birthTime || 'Nije navedeno'}</li>
            <li><strong>Mesto rođenja:</strong> ${orderData.birthPlace}</li>
          </ul>
          <p>Vaš astrološki izveštaj ćete dobiti na ovaj email u najkraćem mogućem roku.</p>
          <p>Srdačan pozdrav,<br>Astro Portal Tim</p>
        `,
      }),
    });

    console.log("Customer email sent:", customerEmailResponse.status);

    return new Response(
      JSON.stringify({ 
        success: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
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

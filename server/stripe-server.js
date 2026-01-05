import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Set it in .env before running payments.');
}

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2024-06-20',
});

const app = express();
const port = process.env.PORT || 4242;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

const openai =
  openaiApiKey.trim() !== ''
    ? new OpenAI({ apiKey: openaiApiKey })
    : null;

// Webhook needs the raw body, so register it before express.json()
app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).send('Webhook secret not set');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // TODO: mark order as paid in DB
      console.log('✅ Checkout session completed', session.id);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      // TODO: handle successful subscription renewal
      console.log('✅ Invoice paid', invoice.id);
      break;
    }
    default:
      console.log(`ℹ️ Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Other routes can use JSON parsing
app.use(cors({ origin: frontendUrl }));
app.use(express.json());

// Simple rate limit for LLM endpoint (per IP)
const llmLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Utility: first day of next month at 00:00 UTC (for aligning subscriptions)
const getFirstOfNextMonthUnix = () => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
};

app.get('/api/stripe/ping', (_req, res) => {
  res.json({ ok: true });
});

// LLM endpoint for compatibility copy
app.post('/api/compatibility-llm', llmLimiter, async (req, res) => {
  if (!openai) {
    return res.status(500).json({ error: 'OpenAI not configured' });
  }

  const { sign1, sign2, compatibility, language = 'sr' } = req.body || {};

  if (!sign1 || !sign2 || typeof compatibility !== 'number') {
    return res.status(400).json({ error: 'Missing sign1/sign2/compatibility' });
  }

  const prompt = `
You are an astrologer copywriter. Write ONE short paragraph (max 80 words) in ${language}
about the couple ${sign1} & ${sign2} with compatibility ${compatibility}%.
Vary vocabulary each time; make it warm, intriguing, and end with a soft CTA to order the full paid analysis.
No lists, no headings—just a single paragraph.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.95,
      max_tokens: 150,
      messages: [
        { role: 'system', content: 'Stay concise, 1 paragraph, persuasive but authentic.' },
        { role: 'user', content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    return res.json({ text });
  } catch (err) {
    console.error('LLM error', err);
    return res.status(500).json({ error: 'LLM error' });
  }
});

// Create Checkout Session for one-time or subscription
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  const { mode, priceId, quantity = 1, customerEmail, successUrl, cancelUrl, anchorToMonthStart = true } = req.body;

  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  if (!['payment', 'subscription'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode. Use payment|subscription' });
  }

  if (!priceId) {
    return res.status(400).json({ error: 'Missing priceId' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl || `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${frontendUrl}/cancel`,
      ...(mode === 'subscription' && anchorToMonthStart
        ? {
            subscription_data: {
              billing_cycle_anchor: getFirstOfNextMonthUnix(),
              proration_behavior: 'none',
            },
          }
        : {}),
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error', err);
    return res.status(500).json({ error: 'Stripe session error' });
  }
});

app.listen(port, () => {
  console.log(`Stripe dev server listening on http://localhost:${port}`);
});

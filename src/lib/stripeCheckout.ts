import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const apiBase = import.meta.env.VITE_API_BASE_URL || '';

type CheckoutMode = 'payment' | 'subscription';

interface CheckoutParams {
  mode: CheckoutMode;
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  anchorToMonthStart?: boolean;
}

export async function startStripeCheckout({
  mode,
  priceId,
  quantity = 1,
  customerEmail,
  anchorToMonthStart = true,
}: CheckoutParams) {
  if (!priceId) throw new Error('priceId is required');

  const res = await fetch(`${apiBase}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      priceId,
      quantity,
      customerEmail,
      anchorToMonthStart,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to create checkout session');
  }

  const { id: sessionId } = await res.json();
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
}

import { loadStripe } from '@stripe/stripe-js';
import { createStripeCheckoutSession, type CreateOrderPayload } from '@/lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export async function startStripeCheckout(payload: CreateOrderPayload) {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  if (!publishableKey) {
    throw new Error('Stripe publishable key is missing.');
  }

  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to initialize.');
  }

  const { id } = await createStripeCheckoutSession(payload);
  const { error } = await stripe.redirectToCheckout({ sessionId: id });
  if (error) {
    throw error;
  }
}

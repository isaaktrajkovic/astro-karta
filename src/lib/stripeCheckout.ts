import { createStripeCheckoutSession, type CreateOrderPayload } from '@/lib/api';

export async function startStripeCheckout(payload: CreateOrderPayload) {
  const { url } = await createStripeCheckoutSession(payload);
  if (!url) {
    throw new Error('Stripe checkout URL is missing.');
  }
  window.location.assign(url);
}

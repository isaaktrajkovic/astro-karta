type StripeMode = 'payment' | 'subscription';

interface StripeProductConfig {
  priceId: string;
  mode: StripeMode;
}

const stripeProducts: Record<string, StripeProductConfig> = {
  // TODO: replace with real Stripe price IDs
  'report-yearly': { priceId: 'price_report_yearly_test', mode: 'payment' },
  'report-love': { priceId: 'price_report_love_test', mode: 'payment' },
  'report-career': { priceId: 'price_report_career_test', mode: 'payment' },
  'consult-email': { priceId: 'price_consult_email_test', mode: 'payment' },
  'consult-vip': { priceId: 'price_consult_vip_test', mode: 'payment' },
  'consult-live': { priceId: 'price_consult_live_test', mode: 'payment' },
};

export const getStripeProduct = (productId: string): StripeProductConfig | undefined =>
  stripeProducts[productId];

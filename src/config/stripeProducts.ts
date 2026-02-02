type StripeMode = 'payment' | 'subscription';

interface StripeProductConfig {
  priceId: string;
  mode: StripeMode;
}

const stripeProducts: Record<string, StripeProductConfig> = {
  // TODO: replace with real Stripe price IDs
  'partner-description': { priceId: 'price_partner_description_test', mode: 'payment' },
  'partner-description-when': { priceId: 'price_partner_description_when_test', mode: 'payment' },
  'report-natal': { priceId: 'price_report_natal_test', mode: 'payment' },
  'report-yearly': { priceId: 'price_report_yearly_test', mode: 'payment' },
  'report-solar': { priceId: 'price_report_solar_test', mode: 'payment' },
  'report-synastry': { priceId: 'price_report_synastry_test', mode: 'payment' },
  'report-questions': { priceId: 'price_report_questions_test', mode: 'payment' },
  'report-love': { priceId: 'price_report_love_test', mode: 'payment' },
  'report-career': { priceId: 'price_report_career_test', mode: 'payment' },
  'consult-email': { priceId: 'price_consult_email_test', mode: 'payment' },
  'consult-vip': { priceId: 'price_consult_vip_test', mode: 'payment' },
  'consult-live': { priceId: 'price_consult_live_test', mode: 'payment' },
};

export const getStripeProduct = (productId: string): StripeProductConfig | undefined =>
  stripeProducts[productId];

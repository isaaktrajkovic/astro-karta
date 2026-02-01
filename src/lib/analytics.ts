const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const sessionKey = 'astro_session_id';
const attributionKey = 'astro_attribution';
const countryKey = 'astro_country';
const countryCodeKey = 'astro_country_code';

let countryPromise: Promise<string | null> | null = null;

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referral_code?: string;
  referrer?: string;
  landing_path?: string;
  updated_at?: string;
};

const safeParse = (value: string | null): Attribution | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as Attribution;
  } catch {
    return null;
  }
};

const normalizeValue = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const fetchCountry = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data = await res.json();
    const countryName = typeof data?.country_name === 'string' ? data.country_name.trim() : '';
    const countryCode = typeof data?.country_code === 'string' ? data.country_code.trim() : '';
    if (typeof window !== 'undefined') {
      if (countryCode) {
        window.localStorage.setItem(countryCodeKey, countryCode);
      }
      if (countryName) {
        window.localStorage.setItem(countryKey, countryName);
      }
    }
    return countryName || countryCode || null;
  } catch {
    return null;
  }
};

const getCountry = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  const storedName = window.localStorage.getItem(countryKey);
  if (storedName) return storedName;
  const storedCode = window.localStorage.getItem(countryCodeKey);
  if (storedCode) return storedCode;
  if (!countryPromise) {
    countryPromise = fetchCountry();
  }
  return countryPromise;
};

export const getSessionId = () => {
  if (typeof window === 'undefined') return '';
  const existing = window.localStorage.getItem(sessionKey);
  if (existing) return existing;
  const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `sess_${Math.random().toString(36).slice(2)}${Date.now()}`;
  window.localStorage.setItem(sessionKey, generated);
  return generated;
};

export const storeAttributionFromUrl = () => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const next = {
    utm_source: normalizeValue(params.get('utm_source')),
    utm_medium: normalizeValue(params.get('utm_medium')),
    utm_campaign: normalizeValue(params.get('utm_campaign')),
    utm_term: normalizeValue(params.get('utm_term')),
    utm_content: normalizeValue(params.get('utm_content')),
    referral_code: normalizeValue(params.get('ref')),
  };

  const existing = safeParse(window.localStorage.getItem(attributionKey)) || {};
  const hasNewParams = Object.values(next).some(Boolean);

  const landing_path = existing.landing_path || `${window.location.pathname}${window.location.search}`;
  const referrer = existing.referrer || normalizeValue(document.referrer);

  const merged: Attribution = {
    ...existing,
    ...Object.fromEntries(Object.entries(next).filter(([, value]) => value)),
    landing_path,
    referrer,
    updated_at: hasNewParams ? new Date().toISOString() : existing.updated_at,
  };

  window.localStorage.setItem(attributionKey, JSON.stringify(merged));
};

export const getAttribution = (): Attribution => {
  if (typeof window === 'undefined') return {};
  return safeParse(window.localStorage.getItem(attributionKey)) || {};
};

const buildPayload = (event_type: string, payload: Record<string, unknown> = {}) => {
  const attribution = getAttribution();
  return {
    event_type,
    session_id: getSessionId(),
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    referral_code: attribution.referral_code,
    referrer: attribution.referrer,
    landing_path: attribution.landing_path,
    ...payload,
  };
};

export const trackEvent = async (event_type: string, payload?: Record<string, unknown>) => {
  if (!apiBase) return;
  const country = await getCountry();
  const body = buildPayload(event_type, {
    ...(country ? { country } : {}),
    ...payload,
  });
  try {
    await fetch(`${apiBase}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};

export const trackPageView = (path: string) => {
  storeAttributionFromUrl();
  trackEvent('page_view', { path });
};

export const trackOrderView = (product_id?: string) => {
  trackEvent('order_view', { product_id });
};

export const trackOrderSuccessView = () => {
  trackEvent('order_success_view');
};

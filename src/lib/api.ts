const apiBase = import.meta.env.VITE_API_BASE_URL || '';

const authTokenKey = 'astro_admin_token';

export interface AuthSession {
  email: string;
}

export interface Order {
  id: number;
  product_id: string;
  product_name: string;
  customer_name: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string;
  city: string;
  country: string;
  email: string;
  gender: string | null;
  note: string | null;
  consultation_description: string | null;
  language: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  landing_path?: string | null;
  session_id?: string | null;
  referral_id: number | null;
  referral_code: string | null;
  base_price_cents: number;
  discount_percent: number;
  discount_amount_cents: number;
  final_price_cents: number;
  referral_commission_percent: number;
  referral_commission_cents: number;
  referral_paid: boolean;
  referral_paid_cents: number;
  referral_paid_at: string | null;
  status: string;
  created_at: string;
}

export type CreateOrderPayload = Omit<
  Order,
  | 'id'
  | 'status'
  | 'created_at'
  | 'referral_id'
  | 'referral_code'
  | 'base_price_cents'
  | 'discount_percent'
  | 'discount_amount_cents'
  | 'final_price_cents'
  | 'referral_commission_percent'
  | 'referral_commission_cents'
  | 'referral_paid'
  | 'referral_paid_cents'
  | 'referral_paid_at'
> & {
  language?: string;
  timezone?: string;
  referral_code?: string | null;
};

export interface CalculatorUsage {
  id: number;
  sign1: string;
  sign2: string;
  compatibility: number;
  created_at: string;
}

export interface HoroscopeSubscription {
  id: string;
  order_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  zodiac_sign: string;
  language: string;
  timezone: string;
  gender: string | null;
  plan: string;
  birth_time: string | null;
  send_hour: number | null;
  status: string;
  start_at: string;
  end_at: string;
  next_send_at: string | null;
  last_sent_at: string | null;
  send_count: number;
  unsubscribed_at: string | null;
  created_at: string;
}

export interface HoroscopeDeliveryLog {
  id: string;
  subscription_id: string;
  email: string;
  zodiac_sign: string;
  horoscope_date: string;
  status: string;
  provider_id: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Referral {
  id: number;
  code: string;
  owner_first_name: string;
  owner_last_name: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
  created_at: string;
  order_count: number;
  pending_count: number;
  processing_count: number;
  completed_count: number;
  cancelled_count: number;
  total_revenue_cents: number;
  total_commission_cents: number;
  paid_commission_cents: number;
  unpaid_commission_cents: number;
}

export interface ReferralOrder {
  id: number;
  customer_name: string;
  product_name: string;
  discount_percent: number;
  referral_commission_percent: number;
  final_price_cents: number;
  referral_commission_cents: number;
  referral_paid: boolean;
  referral_paid_cents: number;
  referral_paid_at: string | null;
  status: string;
  created_at: string;
}

export interface BlogAsset {
  url: string;
  name: string;
  mime?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  images: BlogAsset[];
  attachments: BlogAsset[];
  published_at: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totals: {
    page_views: number;
    unique_visitors: number;
    order_created: number;
    checkout_started: number;
    order_completed: number;
    revenue_cents: number;
  };
  daily: Array<{
    date: string;
    page_views: number;
    unique_visitors: number;
    order_created: number;
    order_completed: number;
    revenue_cents: number;
  }>;
  top_pages: Array<{ path: string; count: number }>;
  top_referrers: Array<{ referrer: string; count: number }>;
  top_countries: Array<{ country: string; count: number }>;
  top_products: Array<{
    product_id: string;
    order_created: number;
    order_completed: number;
    revenue_cents: number;
  }>;
  options: {
    utm_sources: string[];
    utm_campaigns: string[];
    referral_codes: string[];
    products: string[];
  };
}

export interface ReferralUpsertPayload {
  code: string;
  owner_first_name: string;
  owner_last_name: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
}

export interface CreateTestHoroscopeSubscriptionPayload {
  email: string;
  zodiac_sign: string;
  birth_date: string;
  birth_time?: string | null;
  gender?: 'male' | 'female' | 'unspecified';
  plan?: 'basic' | 'premium';
  language?: string;
  timezone?: string;
  send_now?: boolean;
  first_name?: string | null;
  last_name?: string | null;
}

const getAuthToken = () => localStorage.getItem(authTokenKey);

const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(authTokenKey, token);
  } else {
    localStorage.removeItem(authTokenKey);
  }
};

const parseResponseBody = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async <T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> => {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  });

  const data = await parseResponseBody(res);

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: string }).error)
        : res.statusText;
    throw new Error(message || 'Request failed');
  }

  return data as T;
};

export const login = async (email: string, password: string) => {
  const data = await request<{ token: string; user: AuthSession }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token);
  return data;
};

export const getSession = async (): Promise<AuthSession | null> => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const data = await request<{ user: AuthSession }>('/api/auth/session', {
      method: 'GET',
      auth: true,
    });
    return data.user;
  } catch (error) {
    setAuthToken(null);
    return null;
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const getOrders = () =>
  request<{ orders: Order[] }>('/api/orders', {
    method: 'GET',
    auth: true,
  });

export const updateOrderStatus = (orderId: number, status: string) =>
  request<{ success: true }>('/api/orders/' + orderId, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status }),
  });

export const deleteOrders = (orderIds: number[]) =>
  request<{ success: true; deleted: number }>('/api/orders/bulk-delete', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ ids: orderIds }),
  });

export const createOrder = (payload: CreateOrderPayload) =>
  request<{ success: true; orderId: number }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createStripeCheckoutSession = (payload: CreateOrderPayload) =>
  request<{ id: string; url: string | null }>('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const sendOrderReport = (
  orderId: number,
  payload: { subject?: string; message: string; language?: string }
) =>
  request<{ success: true; statusUpdated?: boolean }>(`/api/orders/${orderId}/send-report`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

export const getUsage = () =>
  request<{ usage: CalculatorUsage[] }>('/api/usage', {
    method: 'GET',
    auth: true,
  });

export const getAnalyticsSummary = (params: {
  from: string;
  to: string;
  utm_source?: string;
  utm_campaign?: string;
  referral_code?: string;
  product_id?: string;
}) => {
  const searchParams = new URLSearchParams({
    from: params.from,
    to: params.to,
  });
  if (params.utm_source) searchParams.set('utm_source', params.utm_source);
  if (params.utm_campaign) searchParams.set('utm_campaign', params.utm_campaign);
  if (params.referral_code) searchParams.set('referral_code', params.referral_code);
  if (params.product_id) searchParams.set('product_id', params.product_id);

  return request<AnalyticsSummary>(`/api/analytics/summary?${searchParams.toString()}`, {
    method: 'GET',
    auth: true,
  });
};

export const validateReferralCode = (code: string) =>
  request<{ valid: boolean; code?: string; discountPercent?: number }>(
    `/api/referrals/validate?code=${encodeURIComponent(code)}`,
    {
      method: 'GET',
    }
  );

export const getReferrals = () =>
  request<{ referrals: Referral[] }>('/api/referrals', {
    method: 'GET',
    auth: true,
  });

export const createReferral = (payload: ReferralUpsertPayload) =>
  request<{ success: true; referralId: number }>('/api/referrals', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

export const updateReferral = (referralId: number, payload: ReferralUpsertPayload) =>
  request<{ success: true }>(`/api/referrals/${referralId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });

export const getReferralOrders = (referralId: number) =>
  request<{ orders: ReferralOrder[] }>(`/api/referrals/${referralId}/orders`, {
    method: 'GET',
    auth: true,
  });

export const updateOrderReferralPaid = (
  orderId: number,
  payload: { paid?: boolean; paid_cents?: number }
) =>
  request<{ success: true; paid_cents?: number; is_paid?: boolean }>(
    `/api/orders/${orderId}/referral-paid`,
    {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    }
  );

export const getBlogPosts = () =>
  request<{ posts: BlogPost[] }>('/api/blog', {
    method: 'GET',
  });

export const getBlogPost = (slug: string) =>
  request<{ post: BlogPost }>(`/api/blog/${slug}`, {
    method: 'GET',
  });

export const createBlogPost = async (payload: {
  title: string;
  excerpt?: string;
  content: string;
  images?: File[];
  attachments?: File[];
}) => {
  const formData = new FormData();
  formData.append('title', payload.title);
  if (payload.excerpt) {
    formData.append('excerpt', payload.excerpt);
  }
  formData.append('content', payload.content);
  payload.images?.forEach((file) => formData.append('images', file));
  payload.attachments?.forEach((file) => formData.append('attachments', file));

  const token = getAuthToken();
  const res = await fetch(`${apiBase}/api/blog`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await parseResponseBody(res);
  if (!res.ok) {
    const message = data && typeof data === 'object' && 'error' in data
      ? String((data as { error: string }).error)
      : res.statusText;
    throw new Error(message || 'Request failed');
  }
  return data as { success: true; post: BlogPost };
};

export const deleteBlogPost = (id: number) =>
  request<{ success: true }>(`/api/blog/${id}`, {
    method: 'DELETE',
    auth: true,
  });

export const trackUsage = (payload: Pick<CalculatorUsage, 'sign1' | 'sign2' | 'compatibility'>) =>
  request<{ success: true }>('/api/usage', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getHoroscopeSubscriptions = () =>
  request<{ subscriptions: HoroscopeSubscription[] }>('/api/horoscope/subscriptions', {
    method: 'GET',
    auth: true,
  });

export const cancelHoroscopeSubscription = (subscriptionId: string) =>
  request<{ success: true }>(`/api/horoscope/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    auth: true,
  });

export const updateHoroscopeSendHour = (subscriptionId: string, sendHour: number) =>
  request<{ success: true; subscription: { id: string; send_hour: number; next_send_at: string | null } }>(
    `/api/horoscope/subscriptions/${subscriptionId}/send-hour`,
    {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ send_hour: sendHour }),
    }
  );

export const getHoroscopeDeliveries = (limit = 200) =>
  request<{ deliveries: HoroscopeDeliveryLog[] }>(`/api/horoscope/deliveries?limit=${limit}`, {
    method: 'GET',
    auth: true,
  });

export const createTestHoroscopeSubscription = (payload: CreateTestHoroscopeSubscriptionPayload) =>
  request<{ success: true; subscription_id: string; sent: boolean }>(
    '/api/horoscope/test-subscription',
    {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    }
  );

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
  status: string;
  created_at: string;
}

export type CreateOrderPayload = Omit<Order, 'id' | 'status' | 'created_at'> & {
  language?: string;
  timezone?: string;
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

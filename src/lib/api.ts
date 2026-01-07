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
  note: string | null;
  consultation_description: string | null;
  status: string;
  created_at: string;
}

export interface CalculatorUsage {
  id: number;
  sign1: string;
  sign2: string;
  compatibility: number;
  created_at: string;
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

export const createOrder = (payload: Omit<Order, 'id' | 'status' | 'created_at'>) =>
  request<{ success: true; orderId: number }>('/api/orders', {
    method: 'POST',
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

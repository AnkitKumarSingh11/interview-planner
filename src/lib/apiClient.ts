const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

let inMemorySessionToken: string | null = null;
let isRefreshing = false;
const TOKEN_KEY = 'planly_session_token';
const TIME_KEY = 'planly_session_timestamp';
const PROACTIVE_REFRESH_MS = 30 * 60 * 1000; // 30 minutes
const MAX_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getAuthToken(): string | null {
  if (inMemorySessionToken) {
    return inMemorySessionToken;
  }
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedTime = localStorage.getItem(TIME_KEY);

    if (storedToken && storedTime) {
      const elapsed = Date.now() - parseInt(storedTime, 10);
      if (elapsed > MAX_TTL_MS) {
        clearAuthToken();
        return null;
      }
      inMemorySessionToken = storedToken;
      return storedToken;
    }
  }
  return null;
}

export function setAuthToken(token: string): void {
  inMemorySessionToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TIME_KEY, Date.now().toString());
  }
}

export function clearAuthToken(): void {
  inMemorySessionToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TIME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export async function refreshToken(): Promise<boolean> {
  const currentToken = getAuthToken();
  if (!currentToken || isRefreshing) return false;

  isRefreshing = true;
  try {
    const cleanEndpoint = '/api/auth/refresh';
    const fullUrl = `${BACKEND_URL}${cleanEndpoint}`;

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      credentials: 'same-origin',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAuthToken(data.token);
        return true;
      }
    }
  } catch (err) {
    console.error('Failed to refresh session token:', err);
  } finally {
    isRefreshing = false;
  }

  clearAuthToken();
  return false;
}

export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();

  // Proactive Refresh: If token is older than 30 minutes and user is active, refresh in background
  if (token && typeof window !== 'undefined' && !isRefreshing && !endpoint.includes('/api/auth/refresh')) {
    const storedTime = localStorage.getItem(TIME_KEY);
    if (storedTime) {
      const elapsed = Date.now() - parseInt(storedTime, 10);
      if (elapsed > PROACTIVE_REFRESH_MS) {
        refreshToken().catch((err) => console.error('Background token refresh error:', err));
      }
    }
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${BACKEND_URL}${cleanEndpoint}`;

  let response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  // Security Interceptor: Handle 401 Unauthorized by attempting a silent session token refresh
  if (
    response.status === 401 &&
    token &&
    !cleanEndpoint.includes('/api/auth/refresh') &&
    !cleanEndpoint.includes('/api/auth/login') &&
    !cleanEndpoint.includes('/api/admin/login')
  ) {
    const refreshed = await refreshToken();
    if (refreshed) {
      const newToken = getAuthToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
      }
      response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'same-origin',
      });
    }
  }

  return response;
}

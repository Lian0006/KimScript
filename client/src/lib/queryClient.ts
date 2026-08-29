import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from '../contexts/AuthContext';
import { withCache, CACHE_KEYS, CACHE_TTL } from './cache';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get the API base URL from environment or use Render URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or fallback to Render
    return import.meta.env.VITE_API_URL || 'https://api.kimscript.com';
  }
  // Server-side: use environment variable
  return process.env.API_URL || 'https://api.kimscript.com';
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // If URL is relative, prepend the API base URL
  const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`;
  
  // Get authentication headers
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = data ? { "Content-Type": "application/json" } : {};
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // Determine cache key and TTL based on endpoint
    let cacheKey = url;
    let ttl = CACHE_TTL.MEDIUM;
    
    if (url.includes('/api/scripts')) {
      cacheKey = CACHE_KEYS.SCRIPTS;
      ttl = CACHE_TTL.SHORT;
    } else if (url.includes('/api/analytics')) {
      cacheKey = `${CACHE_KEYS.ANALYTICS}_${queryKey[1] || 'default'}`;
      ttl = CACHE_TTL.MEDIUM;
    } else if (url.includes('/api/analyze-video')) {
      cacheKey = `${CACHE_KEYS.VIDEO_ANALYSIS}_${queryKey[1] || 'default'}`;
      ttl = CACHE_TTL.LONG;
    }

    return withCache(cacheKey, async () => {
      const fullUrl = url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`;
      
      // Get authentication headers
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const res = await fetch(fullUrl, {
        headers,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    }, ttl);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

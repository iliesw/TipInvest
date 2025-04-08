/* eslint-disable @typescript-eslint/no-explicit-any */
export const Server = "https://tipinvest-production-76d3.up.railway.app";
// export const Server = "http://localhost:3001";

async function Fetch(url: string, method = "GET", body = {}, params = {}) {
  // Get authentication token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("TOKENAUTH") : null;
  
  // Prepare headers with authentication token if available
  const headers: Record<string, string> = {};
  
  // Add Content-Type header for non-GET requests with body
  if (method !== "GET" && body) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(Server + url, {
      method: method,
      body: method === "GET" ? undefined : JSON.stringify(body),
      headers,
      ...params,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error occurred');
    }
    throw new Error('Network error occurred');
  }
}

export default class useFetch {
  static async get(url: string, params: any = {}) {
    return Fetch(url, "GET", undefined, { ...params });
  }

  static async post(url: string, body: any, params: any = {}) {
    return Fetch(url, "POST", body, { ...params });
  }
}

export function Logout(){
  localStorage.removeItem("TOKENAUTH");
  window.location.href="/";
}
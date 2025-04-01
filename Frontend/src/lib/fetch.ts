/* eslint-disable @typescript-eslint/no-explicit-any */
// export const Server = "https://tipinvest-production-76d3.up.railway.app";
export const Server = process.env.SERVER || "http://localhost:3001";

function Fetch(url: string, method = "GET", body = {}, params = {}) {
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
  
  return fetch(Server + url, {
    method: method,
    body: method === "GET" ? undefined : JSON.stringify(body),
    headers,
    ...params,
  });
}

export default class useFetch {
  static get = (url: any, params: any = {}) =>
    Fetch(url, "GET", undefined, { ...params });
  static post = (url: any, body: any, params: any = {}) =>
    Fetch(url, "POST", body, { ...params });
}

export function Logout(){
  localStorage.removeItem("TOKENAUTH");
  window.location.href="/";
}
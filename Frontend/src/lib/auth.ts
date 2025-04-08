/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication utility functions for handling JWT tokens and user roles
 */

/**
 * Decodes a JWT token to extract user information
 * @param token - The JWT token to decode
 */
export function decodeToken(token: string) {
  if (!token) return null;
  
  try {
    // Simple JWT decoding (base64)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Checks if the current user has admin role
 * @returns boolean indicating if user is an admin
 */
export function isAdmin() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('TOKENAUTH');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  return decoded && decoded.role === 'admin';
}

/**
 * Checks if the current user has agency role
 * @returns boolean indicating if user is an agency
 */
export function isAgency() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('TOKENAUTH');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  return decoded && decoded.role === 'agency';
}

/**
 * Redirects to login page if user is not authenticated
 * @param router - Next.js router instance
 */
export function requireAuth(router: any) {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('TOKENAUTH');
  if (!token) {
    router.push('/');
    return false;
  }
  
  return true;
}

/**
 * Redirects to home page if user is not an admin
 * @param router - Next.js router instance
 */
export function requireAdmin(router: any) {
  if (!requireAuth(router)) return false;
  
  if (!isAdmin()) {
    router.push('/');
    return false;
  }
  
  return true;
}

/**
 * Redirects to home page if user is not an agency
 * @param router - Next.js router instance
 */
export function requireAgency(router: any) {
  if (!requireAuth(router)) return false;
  
  if (!isAgency()) {
    router.push('/');
    return false;
  }
  
  return true;
}

/**
 * Checks if the current user has expert role
 * @returns boolean indicating if user is an expert
 */
export function isExpert() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('TOKENAUTH');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  return decoded && decoded.role === 'expert';
}

/**
 * Redirects to home page if user is not an expert
 * @param router - Next.js router instance
 */
export function requireExpert(router: any) {
  if (!requireAuth(router)) return false;
  
  if (!isExpert()) {
    router.push('/');
    return false;
  }
  
  return true;
}
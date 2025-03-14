/* eslint-disable @typescript-eslint/no-explicit-any */
const Server = "https://tipinvest-production.up.railway.app";

function Fetch(url: string, method = "GET", body = {}, params = {}) {
  return fetch(Server + url, {
    method: method,
    body: method === "GET" ? undefined : JSON.stringify(body),
    headers:
      method === "GET"
        ? {}
        : body
        ? { "Content-Type": "application/json" }
        : {},
    ...params,
  });
}

export default class useFetch {
  static get = (url: any, params: any = {}) =>
    Fetch(url, "GET", undefined, { ...params });
  static post = (url: any, body: any, params: any = {}) =>
    Fetch(url, "POST", body, { ...params });
}

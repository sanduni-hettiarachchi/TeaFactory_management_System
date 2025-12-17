// src/utils/api.js
// Simple fetch wrapper with retry/backoff and JSON handling

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function apiFetch(path, { method = "GET", body, headers = {}, retries = 2, retryDelayMs = 400 } = {}) {
  const API_URL = "http://localhost:3001";
  const url = `${API_URL}${path}`;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        const message = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      lastError = err;
      // Retry only on network errors or 502/503/504
      const retriable = !err.status || [502, 503, 504].includes(err.status);
      if (attempt < retries && retriable) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
  throw lastError; // Should not reach here
}

// Small fetch helpers for the FlareCMS admin. Every admin screen talks to the
// Pages Functions API on the same origin, sending the existing bearer token.

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function authToken(): string | null {
  return localStorage.getItem("token");
}

export function authHeaders(): Record<string, string> {
  const token = authToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Fetches JSON, attaching the bearer token. Throws ApiError on failure. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = authToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(path, { ...init, headers });
  } catch {
    throw new ApiError("Network error — check your connection", 0);
  }
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  let payload: { error?: string } | null = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!res.ok) {
    throw new ApiError(payload?.error ?? `Request failed (${res.status})`, res.status);
  }
  return payload as unknown as T;
}

/** Uploads one image file to /api/assets; returns the created media row. */
export interface MediaRow {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  altEn: string;
  altLv: string;
  createdAt: number;
}

export async function uploadMedia(file: File): Promise<MediaRow> {
  const form = new FormData();
  form.append("file", file);
  return api<MediaRow>("/api/assets", { method: "POST", body: form });
}

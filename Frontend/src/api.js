const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://tib-ims-backend.vercel.app"
    : "http://localhost:3001");

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("tib_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("tib_token");
      localStorage.removeItem("tib_user");
    }
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function saveSession(data) {
  localStorage.setItem("tib_token", data.token);
  localStorage.setItem("tib_user", JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem("tib_token");
  localStorage.removeItem("tib_user");
}

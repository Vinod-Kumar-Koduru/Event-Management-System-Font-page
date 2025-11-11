const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, opts = {}) {
  const url = API_BASE + path;
  console.log(
    `API Request: ${opts.method || "GET"} ${url}`,
    opts.body ? { body: JSON.parse(opts.body) } : ""
  );

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...opts.headers,
      },
      ...opts,
    });

    console.log(`📥 API Response: ${res.status} ${res.statusText} for ${path}`);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        error: `HTTP ${res.status}: ${res.statusText}`,
        message: `Server returned ${res.status} error`,
      }));

      console.error("❌ API Error:", errorData);

      if (errorData.details && Array.isArray(errorData.details)) {
        const validationErrors = errorData.details
          .map((d) => d.message || d.msg)
          .join(", ");
        throw new Error(
          validationErrors || errorData.error || errorData.message
        );
      }

      const errorMessage =
        errorData.message || errorData.error || `API error: ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (
      error.name === "TypeError" &&
      (error.message.includes("fetch") ||
        error.message.includes("Failed to fetch"))
    ) {
      throw new Error(
        `Cannot connect to server at ${API_BASE}. Please ensure the backend server is running on port 4000.`
      );
    }
    throw error;
  }
}

export const ProfilesAPI = {
  getAll: () => request("/api/profiles"),
  addProfile: (payload) =>
    request("/api/profiles", { method: "POST", body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/profiles/${id}`, { method: "DELETE" }),
  update: (id, payload) =>
    request(`/api/profiles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export const EventsAPI = {
  getAll: (profileId) => request(`/api/events?profileId=${profileId || ""}`),
  addEvent: (payload) =>
    request("/api/events", { method: "POST", body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/events/${id}`, { method: "DELETE" }),
  update: (id, payload) =>
    request(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  get: (id) => request(`/api/events/${id}`),
};

export const LogsAPI = {
  listForEvent: (eventId) => request(`/api/logs/event/${eventId}`),
};

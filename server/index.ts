import {
  handleCreateContacts,
  handleGetContacts,
  handleGetContact,
  handleDeleteContact,
  handleClearContacts,
  handleRegeocodeContacts,
} from "./routes/contacts";

const PORT = parseInt(process.env.CONTACTS_API_PORT || "7201", 10);

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders())) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

Bun.serve({
  port: PORT,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;
    const method = req.method;

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // POST /api/contacts/geocode — must be checked before the :id route
    if (method === "POST" && pathname === "/api/contacts/geocode") {
      return withCors(await handleRegeocodeContacts());
    }

    // POST /api/contacts — batch import
    if (method === "POST" && pathname === "/api/contacts") {
      return withCors(await handleCreateContacts(req));
    }

    // GET /api/contacts — list all
    if (method === "GET" && pathname === "/api/contacts") {
      return withCors(handleGetContacts());
    }

    // GET /api/contacts/:id — single contact
    if (method === "GET" && pathname.startsWith("/api/contacts/")) {
      const id = pathname.slice("/api/contacts/".length);
      if (id) {
        return withCors(handleGetContact(decodeURIComponent(id)));
      }
    }

    // DELETE /api/contacts — clear all
    if (method === "DELETE" && pathname === "/api/contacts") {
      return withCors(handleClearContacts());
    }

    // DELETE /api/contacts/:id — remove single
    if (method === "DELETE" && pathname.startsWith("/api/contacts/")) {
      const id = pathname.slice("/api/contacts/".length);
      if (id) {
        return withCors(handleDeleteContact(decodeURIComponent(id)));
      }
    }

    // Health check
    if (method === "GET" && pathname === "/api/health") {
      return withCors(
        new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    return withCors(
      new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  },
});

console.log(`ChampMaps Contacts API running on http://localhost:${PORT}`);

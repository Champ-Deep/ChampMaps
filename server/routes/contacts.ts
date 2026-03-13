import type { ContactInput } from "../store/types";
import * as store from "../store/contactStore";
import { geocodeContacts } from "../services/geocoder";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/** POST /api/contacts — Batch import contacts */
export async function handleCreateContacts(req: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return error("Invalid JSON body.");
  }

  const inputs: ContactInput[] = Array.isArray(body) ? body : [body];

  if (inputs.length === 0) {
    return error("No contacts provided.");
  }

  for (const input of inputs) {
    if (!input.name || typeof input.name !== "string" || !input.name.trim()) {
      return error("Each contact must have a non-empty 'name' field.");
    }
  }

  const created = inputs.map((input) => {
    const contact = store.createContact(input);
    store.upsert(contact);
    return contact;
  });

  // Fire-and-forget geocoding for pending contacts
  const pending = created.filter((c) => c.geocodeStatus === "pending");
  if (pending.length > 0) {
    geocodeContacts(pending).then((resolved) => {
      for (const contact of resolved) {
        store.upsert(contact);
      }
    });
  }

  return json({ contacts: created, count: created.length }, 201);
}

/** GET /api/contacts — List all contacts */
export function handleGetContacts(): Response {
  const contacts = store.getAll();
  return json({ contacts, count: contacts.length });
}

/** GET /api/contacts/:id — Get single contact */
export function handleGetContact(id: string): Response {
  const contact = store.getById(id);
  if (!contact) {
    return error("Contact not found.", 404);
  }
  return json(contact);
}

/** DELETE /api/contacts/:id — Remove single contact */
export function handleDeleteContact(id: string): Response {
  const existed = store.remove(id);
  if (!existed) {
    return error("Contact not found.", 404);
  }
  return json({ deleted: true, id });
}

/** DELETE /api/contacts — Clear all contacts */
export function handleClearContacts(): Response {
  store.clear();
  return json({ deleted: true, message: "All contacts removed." });
}

/** POST /api/contacts/geocode — Re-geocode all pending/failed contacts */
export async function handleRegeocodeContacts(): Promise<Response> {
  const all = store.getAll();
  const unresolved = all.filter(
    (c) => c.geocodeStatus === "pending" || c.geocodeStatus === "failed",
  );

  if (unresolved.length === 0) {
    return json({ message: "No contacts need geocoding.", geocoded: 0 });
  }

  // Reset failed contacts to pending for retry
  for (const contact of unresolved) {
    contact.geocodeStatus = "pending";
  }

  const resolved = await geocodeContacts(unresolved);
  for (const contact of resolved) {
    store.upsert(contact);
  }

  const successCount = resolved.filter(
    (c) => c.geocodeStatus === "resolved",
  ).length;

  return json({
    message: `Geocoded ${successCount} of ${unresolved.length} contacts.`,
    geocoded: successCount,
    total: unresolved.length,
  });
}

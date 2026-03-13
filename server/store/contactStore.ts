import type { Contact, ContactInput } from "./types";

const contacts = new Map<string, Contact>();

let nextId = 1;

function generateId(): string {
  return `contact-${Date.now()}-${nextId++}`;
}

/** Build the address string from structured input fields. */
function buildAddressQuery(input: ContactInput): string {
  const parts = [input.street, input.city, input.state, input.zip, input.country];
  const joined = parts.filter(Boolean).join(", ");
  return joined || input.address || "";
}

/** Returns true when the input already has usable coordinates. */
function hasCoordinates(input: ContactInput): boolean {
  return (
    typeof input.lat === "number" &&
    typeof input.lon === "number" &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lon)
  );
}

/** Create a Contact from raw input. Coordinates are set if present, otherwise pending. */
export function createContact(input: ContactInput): Contact {
  const id = input.id?.trim() || generateId();
  const addressQuery = buildAddressQuery(input);

  if (hasCoordinates(input)) {
    return {
      id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      lat: input.lat!,
      lon: input.lon!,
      address: addressQuery || `${input.lat}, ${input.lon}`,
      geocodeStatus: "resolved",
    };
  }

  return {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    lat: null,
    lon: null,
    address: addressQuery,
    geocodeStatus: addressQuery ? "pending" : "failed",
  };
}

export function getAll(): Contact[] {
  return Array.from(contacts.values());
}

export function getById(id: string): Contact | undefined {
  return contacts.get(id);
}

export function upsert(contact: Contact): void {
  contacts.set(contact.id, contact);
}

export function remove(id: string): boolean {
  return contacts.delete(id);
}

export function clear(): void {
  contacts.clear();
}

export function getPending(): Contact[] {
  return Array.from(contacts.values()).filter(
    (c) => c.geocodeStatus === "pending",
  );
}

import type { Contact } from "../store/types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const REQUEST_DELAY_MS = 1100; // Nominatim usage policy: max 1 req/s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

/** Geocode a single address query via Nominatim. Returns null on failure. */
async function geocodeAddress(
  query: string,
): Promise<{ lat: number; lon: number; displayName: string } | null> {
  if (!query.trim()) {
    return null;
  }

  const url = `${NOMINATIM_BASE}/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ChampMaps-ContactsAPI/1.0",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return null;
    }

    const data: NominatimResult[] = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const first = data[0];
    const lat = parseFloat(first.lat);
    const lon = parseFloat(first.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    return { lat, lon, displayName: first.display_name };
  } catch {
    return null;
  }
}

/**
 * Geocode a batch of contacts that have status "pending".
 * Mutates the contacts in-place and returns the updated array.
 * Respects Nominatim rate limits (1 request per second).
 */
export async function geocodeContacts(contacts: Contact[]): Promise<Contact[]> {
  const updated: Contact[] = [];

  for (const contact of contacts) {
    if (contact.geocodeStatus !== "pending" || !contact.address) {
      updated.push(contact);
      continue;
    }

    const result = await geocodeAddress(contact.address);

    if (result) {
      contact.lat = result.lat;
      contact.lon = result.lon;
      contact.address = result.displayName;
      contact.geocodeStatus = "resolved";
    } else {
      contact.geocodeStatus = "failed";
    }

    updated.push(contact);

    // Respect Nominatim rate limit
    await sleep(REQUEST_DELAY_MS);
  }

  return updated;
}

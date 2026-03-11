import type { IContactsPort } from "../domain/ports";
import type { Contact, ContactInput, ContactsApiResponse } from "../domain/types";

const TIMEOUT_MS = 30_000;

export function createContactsApiAdapter(baseUrl: string): IContactsPort {
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${baseUrl.replace(/\/+$/, "")}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      let message = `API error ${response.status}`;
      try {
        const parsed = JSON.parse(body);
        if (parsed.error) {
          message = parsed.error;
        }
      } catch {
        // Use default message
      }
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  return {
    async fetchContacts(): Promise<Contact[]> {
      const data = await request<ContactsApiResponse>("/api/contacts");
      return data.contacts;
    },

    async importContacts(inputs: ContactInput[]): Promise<Contact[]> {
      const data = await request<ContactsApiResponse>("/api/contacts", {
        method: "POST",
        body: JSON.stringify(inputs),
      });
      return data.contacts;
    },

    async deleteContact(id: string): Promise<void> {
      await request(`/api/contacts/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },

    async clearContacts(): Promise<void> {
      await request("/api/contacts", { method: "DELETE" });
    },

    async triggerGeocode(): Promise<{ geocoded: number; total: number }> {
      return request("/api/contacts/geocode", { method: "POST" });
    },
  };
}

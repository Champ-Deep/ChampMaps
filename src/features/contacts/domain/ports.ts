import type { Contact, ContactInput } from "./types";

export interface IContactsPort {
  /** Fetch all contacts from the API. */
  fetchContacts(): Promise<Contact[]>;

  /** Import one or more contacts into the API. */
  importContacts(inputs: ContactInput[]): Promise<Contact[]>;

  /** Delete a single contact by ID. */
  deleteContact(id: string): Promise<void>;

  /** Delete all contacts. */
  clearContacts(): Promise<void>;

  /** Trigger server-side re-geocoding for pending/failed contacts. */
  triggerGeocode(): Promise<{ geocoded: number; total: number }>;
}

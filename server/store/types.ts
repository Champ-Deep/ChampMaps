export type ContactGeoStatus = "resolved" | "pending" | "failed";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  lat: number | null;
  lon: number | null;
  address: string;
  geocodeStatus: ContactGeoStatus;
}

export interface ContactInput {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  lat?: number;
  lon?: number;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

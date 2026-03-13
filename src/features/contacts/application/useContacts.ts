import { useCallback, useEffect, useRef } from "react";
import { usePosterContext } from "@/features/poster/ui/PosterContext";
import { createContactsApiAdapter } from "../infrastructure/contactsApiAdapter";
import type { ContactInput } from "../domain/types";
import type { IContactsPort } from "../domain/ports";
import type { MarkerItem } from "@/features/markers/domain/types";
import {
  DEFAULT_MARKER_SIZE,
  DEFAULT_MARKER_COLOR,
} from "@/features/markers/infrastructure/constants";
import { featuredMarkerIcons } from "@/features/markers/infrastructure/iconRegistry";

const CONTACT_MARKER_ICON_ID = featuredMarkerIcons[0]?.id ?? "pin";
const POLL_INTERVAL_MS = 5_000;

/**
 * Converts resolved contacts into MarkerItems for display on the map.
 * Each contact marker ID is prefixed with "contact:" to distinguish
 * from user-placed markers.
 */
function contactsToMarkers(
  contacts: { id: string; lat: number | null; lon: number | null }[],
  themeColor: string,
): MarkerItem[] {
  return contacts
    .filter(
      (c): c is typeof c & { lat: number; lon: number } =>
        c.lat !== null && c.lon !== null,
    )
    .map((c) => ({
      id: `contact:${c.id}`,
      lat: c.lat,
      lon: c.lon,
      iconId: CONTACT_MARKER_ICON_ID,
      size: DEFAULT_MARKER_SIZE,
      color: themeColor || DEFAULT_MARKER_COLOR,
    }));
}

export function useContacts() {
  const { state, dispatch, effectiveTheme } = usePosterContext();
  const adapterRef = useRef<IContactsPort | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const apiUrl = state.contactsApiUrl;
  const connected = state.contactsConnected;

  // Rebuild adapter when URL changes
  useEffect(() => {
    if (apiUrl.trim()) {
      adapterRef.current = createContactsApiAdapter(apiUrl.trim());
    } else {
      adapterRef.current = null;
    }
  }, [apiUrl]);

  const fetchContacts = useCallback(async () => {
    const adapter = adapterRef.current;
    if (!adapter) {
      return;
    }

    dispatch({ type: "SET_CONTACTS_LOADING", loading: true });
    dispatch({ type: "SET_CONTACTS_ERROR", error: "" });

    try {
      const contacts = await adapter.fetchContacts();
      dispatch({ type: "SET_CONTACTS", contacts });

      // Sync contact markers — remove old contact markers, add new ones
      const currentMarkers = state.markers.filter(
        (m) => !m.id.startsWith("contact:"),
      );
      const contactMarkers = contactsToMarkers(contacts, effectiveTheme.ui.text);

      // Batch: clear all markers and re-add user markers + contact markers
      dispatch({ type: "CLEAR_MARKERS" });
      for (const marker of [...currentMarkers, ...contactMarkers]) {
        dispatch({ type: "ADD_MARKER", marker });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch contacts.";
      dispatch({ type: "SET_CONTACTS_ERROR", error: message });
    } finally {
      dispatch({ type: "SET_CONTACTS_LOADING", loading: false });
    }
  }, [dispatch, state.markers, effectiveTheme.ui.text]);

  const connect = useCallback(
    async (url?: string) => {
      if (url !== undefined) {
        dispatch({ type: "SET_CONTACTS_API_URL", url });
      }

      dispatch({ type: "SET_CONTACTS_CONNECTED", connected: true });
      // Initial fetch will be triggered by the polling effect
    },
    [dispatch],
  );

  const disconnect = useCallback(() => {
    dispatch({ type: "SET_CONTACTS_CONNECTED", connected: false });
    dispatch({ type: "SET_CONTACTS", contacts: [] });
    dispatch({ type: "SET_CONTACTS_ERROR", error: "" });

    // Remove contact markers
    const userMarkers = state.markers.filter(
      (m) => !m.id.startsWith("contact:"),
    );
    dispatch({ type: "CLEAR_MARKERS" });
    for (const marker of userMarkers) {
      dispatch({ type: "ADD_MARKER", marker });
    }
  }, [dispatch, state.markers]);

  const importContacts = useCallback(
    async (inputs: ContactInput[]) => {
      const adapter = adapterRef.current;
      if (!adapter) {
        throw new Error("No API connection configured.");
      }

      dispatch({ type: "SET_CONTACTS_LOADING", loading: true });
      try {
        await adapter.importContacts(inputs);
        // Refresh after import
        await fetchContacts();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Import failed.";
        dispatch({ type: "SET_CONTACTS_ERROR", error: message });
        throw err;
      } finally {
        dispatch({ type: "SET_CONTACTS_LOADING", loading: false });
      }
    },
    [dispatch, fetchContacts],
  );

  const triggerGeocode = useCallback(async () => {
    const adapter = adapterRef.current;
    if (!adapter) {
      return;
    }

    dispatch({ type: "SET_CONTACTS_LOADING", loading: true });
    try {
      await adapter.triggerGeocode();
      await fetchContacts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Geocoding failed.";
      dispatch({ type: "SET_CONTACTS_ERROR", error: message });
    } finally {
      dispatch({ type: "SET_CONTACTS_LOADING", loading: false });
    }
  }, [dispatch, fetchContacts]);

  // Poll for contact updates when connected
  useEffect(() => {
    if (!connected || !apiUrl.trim()) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchContacts();

    pollRef.current = setInterval(fetchContacts, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [connected, apiUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    contacts: state.contacts,
    contactsLoading: state.contactsLoading,
    contactsError: state.contactsError,
    contactsConnected: state.contactsConnected,
    contactsApiUrl: state.contactsApiUrl,
    connect,
    disconnect,
    fetchContacts,
    importContacts,
    triggerGeocode,
  };
}

import { useState } from "react";
import { useContacts } from "../application/useContacts";
import { usePosterContext } from "@/features/poster/ui/PosterContext";

export default function ContactsSection() {
  const { dispatch } = usePosterContext();
  const {
    contacts,
    contactsLoading,
    contactsError,
    contactsConnected,
    contactsApiUrl,
    connect,
    disconnect,
    triggerGeocode,
  } = useContacts();

  const [urlInput, setUrlInput] = useState(contactsApiUrl);

  const resolvedCount = contacts.filter(
    (c) => c.geocodeStatus === "resolved",
  ).length;
  const pendingCount = contacts.filter(
    (c) => c.geocodeStatus === "pending",
  ).length;
  const failedCount = contacts.filter(
    (c) => c.geocodeStatus === "failed",
  ).length;

  const handleConnect = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      return;
    }
    dispatch({ type: "SET_CONTACTS_API_URL", url: trimmed });
    connect(trimmed);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConnect();
    }
  };

  return (
    <section className="contacts-section">
      <h3>Contact Map</h3>
      <p className="contacts-description">
        Connect to a contact database API to display contact locations on the
        map.
      </p>

      <div className="contacts-url-row">
        <input
          type="url"
          className="contacts-url-input"
          placeholder="https://your-api.com"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={contactsConnected}
          aria-label="Contacts API URL"
        />
        {contactsConnected ? (
          <button
            type="button"
            className="contacts-btn contacts-btn--disconnect"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            className="contacts-btn contacts-btn--connect"
            onClick={handleConnect}
            disabled={!urlInput.trim()}
          >
            Connect
          </button>
        )}
      </div>

      {contactsError ? (
        <p className="contacts-error">{contactsError}</p>
      ) : null}

      {contactsConnected ? (
        <div className="contacts-status">
          <div className="contacts-stats">
            <span className="contacts-stat">
              <span className="contacts-stat-count">{contacts.length}</span>{" "}
              total
            </span>
            <span className="contacts-stat contacts-stat--resolved">
              <span className="contacts-stat-count">{resolvedCount}</span>{" "}
              mapped
            </span>
            {pendingCount > 0 ? (
              <span className="contacts-stat contacts-stat--pending">
                <span className="contacts-stat-count">{pendingCount}</span>{" "}
                pending
              </span>
            ) : null}
            {failedCount > 0 ? (
              <span className="contacts-stat contacts-stat--failed">
                <span className="contacts-stat-count">{failedCount}</span>{" "}
                failed
              </span>
            ) : null}
          </div>

          {contactsLoading ? (
            <p className="contacts-loading">Loading contacts...</p>
          ) : null}

          {pendingCount > 0 || failedCount > 0 ? (
            <button
              type="button"
              className="contacts-btn contacts-btn--geocode"
              onClick={triggerGeocode}
              disabled={contactsLoading}
            >
              {failedCount > 0 ? "Retry Geocoding" : "Geocode Pending"}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

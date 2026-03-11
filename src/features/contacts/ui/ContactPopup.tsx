import type { Contact } from "../domain/types";

interface ContactPopupProps {
  contact: Contact;
  style?: React.CSSProperties;
}

export default function ContactPopup({ contact, style }: ContactPopupProps) {
  return (
    <div className="contact-popup" style={style}>
      <p className="contact-popup-name">{contact.name}</p>
      {contact.company ? (
        <p className="contact-popup-company">{contact.company}</p>
      ) : null}
      {contact.email ? (
        <p className="contact-popup-email">{contact.email}</p>
      ) : null}
      {contact.phone ? (
        <p className="contact-popup-phone">{contact.phone}</p>
      ) : null}
      <p className="contact-popup-address">{contact.address}</p>
    </div>
  );
}

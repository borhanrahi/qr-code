import type { QrContentType } from "./types";

export type ContentTypeDef = {
  value: QrContentType;
  label: string;
  icon: string;
  /** Optional trailing tag rendered inside the tab (e.g. payment rails). */
  tag?: string;
  /** Short blurb used on SEO landing pages. */
  blurb: string;
};

/** Content type registry — drives the tab strip, forms map and SEO pages. */
export const CONTENT_TYPES: ContentTypeDef[] = [
  { value: "url", label: "URL / Web", icon: "link", blurb: "Link any website, landing page or campaign route." },
  { value: "bangla", label: "Bangla QR", icon: "currency_exchange", tag: "bKash•Nagad", blurb: "EMVCo compliant merchant payment code." },
  { value: "wifi", label: "WiFi WPA3", icon: "wifi", blurb: "Share network credentials in one scan." },
  { value: "vcard", label: "vCard Pro (v3/4)", icon: "contact_page", blurb: "Full digital contact card." },
  { value: "text", label: "Markdown / Raw", icon: "notes", blurb: "Plain text or markdown payload." },
  { value: "email", label: "Email", icon: "alternate_email", blurb: "Pre-filled email with subject and body." },
  { value: "sms", label: "SMS Message", icon: "sms", blurb: "Draft an SMS to a number." },
  { value: "phone", label: "Phone Dial", icon: "call", blurb: "Start a call on dial." },
  { value: "geo", label: "Geo Location", icon: "pin_drop", blurb: "Open a map pin at coordinates." },
  { value: "event", label: "iCal Event", icon: "event", blurb: "Calendar invite that adds in one tap." },
  { value: "whatsapp", label: "WhatsApp / Social", icon: "chat", blurb: "Open a WhatsApp chat with a message." },
  { value: "file", label: "File & PDF", icon: "attach_file", blurb: "Direct link to a PDF, image or audio file." },
  { value: "crypto", label: "Crypto (BTC/ETH)", icon: "currency_bitcoin", blurb: "Payment address with optional amount." },
];

export const getContentTypeDef = (value: QrContentType): ContentTypeDef =>
  CONTENT_TYPES.find((type) => type.value === value) ?? CONTENT_TYPES[0];

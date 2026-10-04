import type { QrContentType } from "./types";

export type Preset = {
  label: string;
  /** Short description shown in the presets panel. */
  caption: string;
  /** Field values applied to the target type. */
  apply: Record<string, string>;
  /** Content type the preset switches to (defaults to the active type). */
  type?: QrContentType;
};

export type PresetGroup = {
  group: string;
  presets: Preset[];
};

/**
 * Curated starting points, grouped by intent. Every entry maps onto real field names from the
 * content forms, so picking one fills the form and updates the live matrix immediately.
 */
export const PRESET_GROUPS: PresetGroup[] = [
  {
    group: "Campaigns & Marketing",
    presets: [
      {
        label: "Campaign Landing",
        caption: "Tracked URL for a seasonal campaign",
        apply: { url: "scancraft.studio/go/spring-tech-conf-2025" },
      },
      {
        label: "Google 5★ Review",
        caption: "Ask happy customers for a review",
        apply: { url: "g.page/r/scancraft/review" },
      },
      {
        label: "Product Packaging",
        caption: "Link to a product page with a ref tag",
        apply: { url: "scancraft.studio/products/tea-blend?ref=packaging" },
      },
    ],
  },
  {
    group: "Bangladesh & Payments",
    presets: [
      {
        label: "bKash / Nagad Merchant",
        caption: "EMVCo merchant payment payload",
        type: "bangla",
        apply: {
          merchant: "ScanCraft Studio",
          account: "01712345678",
          amount: "250",
          reference: "ORDER-2049",
        },
      },
      {
        label: "Restaurant Menu",
        caption: "Direct PDF link for a table tent",
        type: "file",
        apply: { fileUrl: "scancraft.studio/files/menu.pdf" },
      },
      {
        label: "Delivery Tracking",
        caption: "Order status page for a parcel label",
        apply: { url: "scancraft.studio/track/ORDER-2049" },
      },
    ],
  },
  {
    group: "Hospitality & Networking",
    presets: [
      {
        label: "Guest WiFi",
        caption: "One-scan network join for cafés",
        type: "wifi",
        apply: { ssid: "ScanCraft-Studio", password: "vector2025", security: "WPA" },
      },
      {
        label: "Digital Business Card",
        caption: "vCard with phone, email and address",
        type: "vcard",
        apply: {
          firstName: "Rafi",
          lastName: "Ahmed",
          org: "ScanCraft",
          title: "Product Designer",
          phone: "+8801712345678",
          email: "rafi@scancraft.studio",
          address: "Dhaka, Bangladesh",
        },
      },
      {
        label: "Event Check-In",
        caption: "Calendar invite with venue details",
        type: "event",
        apply: {
          title: "Spring Tech Conf 2025",
          start: "20250101T100000Z",
          end: "20250101T120000Z",
          location: "Dhaka, Bangladesh",
          description: "Client-side QR engineering summit.",
        },
      },
      {
        label: "Store Location",
        caption: "Map pin for a shop front",
        type: "geo",
        apply: { lat: "23.8103", lng: "90.4125" },
      },
      {
        label: "WhatsApp Chat",
        caption: "Open a chat with a discount code",
        type: "whatsapp",
        apply: { phone: "8801712345678", message: "Hi! I scanned your QR code." },
      },
      {
        label: "Support Call",
        caption: "Phone dialer for a helpline",
        type: "phone",
        apply: { phone: "+8801712345678" },
      },
      {
        label: "Feedback SMS",
        caption: "Pre-written SMS to a short code",
        type: "sms",
        apply: { phone: "+8801712345678", message: "Table 12 was great." },
      },
    ],
  },
  {
    group: "Crypto & Special",
    presets: [
      {
        label: "Bitcoin Donation",
        caption: "BTC address with a suggested amount",
        type: "crypto",
        apply: {
          currency: "bitcoin",
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          amount: "0.0025",
        },
      },
      {
        label: "Email Subscribe",
        caption: "Pre-filled subject and body",
        type: "email",
        apply: {
          email: "hello@scancraft.studio",
          subject: "Campaign QR artwork",
          body: "Hi, here is the QR code for our campaign.",
        },
      },
    ],
  },
];
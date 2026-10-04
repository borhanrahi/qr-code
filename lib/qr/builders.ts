import type { QrContentType } from "./types";

/**
 * Payload formats follow the guide (qr-generator-guide.md §7).
 * Each builder is pure: values in, encoded QR string out.
 */
type Builder = (values: Record<string, string>) => string;

const or = (value: string | undefined, fallback = "") => value?.trim() || fallback;

const buildUrl: Builder = ({ url }) => {
  const raw = or(url, "https://example.com");
  return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
};

const buildText: Builder = ({ text }) => or(text, "Hello from ScanCraft");

const buildEmail: Builder = ({ email, subject, body }) =>
  `mailto:${or(email, "hello@example.com")}` +
  `?subject=${encodeURIComponent(or(subject))}&body=${encodeURIComponent(or(body))}`;

const buildSms: Builder = ({ phone, message }) =>
  `SMSTO:${or(phone, "+8801XXXXXXXXX")}:${or(message)}`;

const buildPhone: Builder = ({ phone }) => `tel:${or(phone, "+8801XXXXXXXXX")}`;

const buildWifi: Builder = ({ ssid, password, security }) =>
  `WIFI:T:${or(security, "WPA")};S:${or(ssid, "MyNetwork")};P:${or(password)};;`;

const buildGeo: Builder = ({ lat, lng }) =>
  `geo:${or(lat, "23.8103")},${or(lng, "90.4125")}`;

const buildVcard: Builder = (v) =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${or(v.lastName)};${or(v.firstName)}`,
    `FN:${or(`${v.firstName} ${v.lastName}`, "Full Name")}`,
    `ORG:${or(v.org)}`,
    `TITLE:${or(v.title)}`,
    `TEL;TYPE=CELL:${or(v.phone)}`,
    `EMAIL:${or(v.email)}`,
    `ADR:;;${or(v.address)};;;;`,
    "END:VCARD",
  ]
    .filter((line) => !line.endsWith(":"))
    .join("\n");

const buildEvent: Builder = (e) =>
  [
    "BEGIN:VEVENT",
    `SUMMARY:${or(e.title, "Event")}`,
    `DTSTART:${or(e.start, "20250101T100000Z")}`,
    `DTEND:${or(e.end, "20250101T120000Z")}`,
    `LOCATION:${or(e.location)}`,
    `DESCRIPTION:${or(e.description)}`,
    "END:VEVENT",
  ]
    .filter((line) => !line.endsWith(":"))
    .join("\n");

const buildWhatsapp: Builder = ({ phone, message }) =>
  `https://wa.me/${or(phone, "8801XXXXXXXXX").replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    or(message),
  )}`;

const buildCrypto: Builder = ({ currency, address, amount }) =>
  `${or(currency, "bitcoin").toLowerCase()}:${or(address, "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")}` +
  (or(amount) ? `?amount=${amount}` : "");

const buildBangla: Builder = (b) =>
  `BQR|MC:${or(b.merchant, "Merchant")}|AC:${or(b.account, "01XXXXXXXXX")}|AM:${
    or(b.amount, "0")
  }|CU:BDT|RF:${or(b.reference)}`;

const buildFile: Builder = ({ fileUrl }) => buildUrl({ url: or(fileUrl, "https://example.com/file.pdf") });

const builders: Record<QrContentType, Builder> = {
  url: buildUrl,
  bangla: buildBangla,
  wifi: buildWifi,
  vcard: buildVcard,
  text: buildText,
  email: buildEmail,
  sms: buildSms,
  phone: buildPhone,
  geo: buildGeo,
  event: buildEvent,
  whatsapp: buildWhatsapp,
  file: buildFile,
  crypto: buildCrypto,
};

export function buildPayload(
  type: QrContentType,
  values: Record<string, string>,
): string {
  return builders[type](values);
}

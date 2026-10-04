"use client";

import { create } from "zustand";
import {
  DEFAULT_DESIGN,
  type QrContentType,
  type QrDesign,
  type QrContentValues,
} from "@/lib/qr/types";

/** Seed values so every tab opens with a sensible, scannable payload. */
const DEFAULT_VALUES: Record<QrContentType, QrContentValues> = {
  url: { url: "scancraft.studio/go/spring-tech-conf-2025" },
  bangla: {
    merchant: "ScanCraft Studio",
    account: "01712345678",
    amount: "250",
    reference: "ORDER-2049",
  },
  wifi: { ssid: "ScanCraft-Studio", password: "vector2025", security: "WPA" },
  vcard: {
    firstName: "Rafi",
    lastName: "Ahmed",
    org: "ScanCraft",
    title: "Product Designer",
    phone: "+8801712345678",
    email: "rafi@scancraft.studio",
    address: "Dhaka, Bangladesh",
  },
  text: { text: "ScanCraft — next-gen QR code studio. 100% client-side." },
  email: {
    email: "hello@scancraft.studio",
    subject: "Campaign QR artwork",
    body: "Hi, here is the QR code for our campaign.",
  },
  sms: { phone: "+8801712345678", message: "Your table is ready. Show this code." },
  phone: { phone: "+8801712345678" },
  geo: { lat: "23.8103", lng: "90.4125" },
  event: {
    title: "Spring Tech Conf 2025",
    start: "20250101T100000Z",
    end: "20250101T120000Z",
    location: "Dhaka, Bangladesh",
    description: "Client-side QR engineering summit.",
  },
  whatsapp: { phone: "8801712345678", message: "Hi! I scanned your QR code." },
  file: { fileUrl: "scancraft.studio/files/menu.pdf" },
  crypto: {
    currency: "bitcoin",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    amount: "0.0025",
  },
};

export type QrStore = {
  activeType: QrContentType;
  values: Record<QrContentType, QrContentValues>;
  design: QrDesign;
  dynamic: boolean;
  setType: (type: QrContentType) => void;
  setValue: (type: QrContentType, key: string, value: string) => void;
  setDesign: (patch: Partial<QrDesign>) => void;
  setDynamic: (dynamic: boolean) => void;
};

export const useQrStore = create<QrStore>((set) => ({
  activeType: "url",
  values: DEFAULT_VALUES,
  design: DEFAULT_DESIGN,
  dynamic: false,
  setType: (type) => set({ activeType: type }),
  setValue: (type, key, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [type]: { ...state.values[type], [key]: value },
      },
    })),
  setDesign: (patch) => set((state) => ({ design: { ...state.design, ...patch } })),
  setDynamic: (dynamic) => set({ dynamic }),
}));

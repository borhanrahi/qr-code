"use client";

import type { ReactElement } from "react";
import type { QrContentType } from "@/lib/qr/types";
import { UrlForm } from "./url-form";
import { PaymentForm } from "./payment-form";
import { WifiForm } from "./wifi-form";
import { VCardForm } from "./vcard-form";
import { TextForm } from "./text-form";
import { EmailForm } from "./email-form";
import { SmsForm } from "./sms-form";
import { PhoneForm } from "./phone-form";
import { GeoForm } from "./geo-form";
import { EventForm } from "./event-form";
import { WhatsappForm } from "./whatsapp-form";
import { FileForm } from "./file-form";
import { CryptoForm } from "./crypto-form";

/** One form component per content type — swap by changing the active type. */
const FORMS: Record<QrContentType, () => ReactElement> = {
  url: UrlForm,
  bangla: PaymentForm,
  wifi: WifiForm,
  vcard: VCardForm,
  text: TextForm,
  email: EmailForm,
  sms: SmsForm,
  phone: PhoneForm,
  geo: GeoForm,
  event: EventForm,
  whatsapp: WhatsappForm,
  file: FileForm,
  crypto: CryptoForm,
};

export function ContentForm({ type }: { type: QrContentType }) {
  const Form = FORMS[type];
  return <Form />;
}

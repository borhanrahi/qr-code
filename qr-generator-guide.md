# QR Code Generator – Full Project Guide (Next.js)

> Based on QRCode Monkey (fully reviewed), QR Code Cactus and qrcode.bd (partially reviewed – verify manually).

## 1. Goals
- Free, unlimited static QR codes (client-side, zero server cost)
- Rich design customization
- Paid tier: dynamic QR + analytics
- Bangladesh focus: Bangla UI, Bangla QR / bKash / Nagad payment formats

## 2. Feature List

### 2.1 Content Types
URL, Text, Email, SMS, Phone, vCard (v3), MeCard, Location, WiFi, Calendar event, Facebook, Twitter/X, YouTube, WhatsApp, Crypto (BTC/ETH/LTC...), File (PDF/MP3/image), Bangla QR / payment

### 2.2 Design
- Single colour / linear / radial gradient
- Custom eye frame and eye ball colours
- Background colour (+ transparent)
- Body shapes, eye-frame shapes, eye-ball shapes
- Logo upload (PNG/JPG/SVG, max 2 MB), logo gallery, remove-background-behind-logo
- Templates
- Error correction L/M/Q/H (up to 30%)
- Resolution slider

### 2.3 Export
PNG, SVG, PDF, EPS (EPS/PDF = plain design only), copy to clipboard

### 2.4 Account / Paid
Saved designs, dynamic QR (editable URL), scan analytics (time, device, country), folders, bulk CSV, custom domain, API, per-code or subscription billing

## 3. Roadmap
| Phase | Scope |
|---|---|
| MVP | All content types, design panel, PNG/SVG, live preview |
| v2 | PDF/EPS, bulk CSV, templates, Bangla QR, i18n |
| v3 | Auth, dynamic QR, analytics, billing |

## 4. UI Guide
1. Header: logo, tool, pricing, language toggle (EN/BN), dark mode.
2. Type tabs: horizontal scrollable strip of content types.
3. Two-column layout: form (left), sticky live preview (right); mobile: preview in bottom sheet.
4. Wizard: 1 Content -> 2 Design -> 3 Download.
5. Design accordions: Colours, Logo, Shapes, Quality.
6. Warnings: low contrast, big logo (>30%), long data.
7. Download bar: PNG / SVG / PDF + size slider.
8. Style: light, one accent colour, rounded cards, no ads above the tool.
9. Footer: links to type pages, FAQ, privacy.
10. Accessibility: labels, keyboard focus, alt text on QR.

## 5. Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| QR engine | qr-code-styling (canvas/SVG) |
| PDF | jsPDF / pdf-lib |
| State | Zustand |
| i18n | next-intl |
| DB (v3) | PostgreSQL + Prisma/Drizzle |
| Auth (v3) | Auth.js |
| Redirect/analytics API | Next route handlers or FastAPI |
| Hosting | Vercel free tier or VPS + Docker |

Why Next.js over Laravel: generator is client-side, SEO pages via SSG/ISR, same language front to back. Choose Laravel only if you want built-in auth/billing/admin with minimal code.

## 6. Folder Structure
```
qr-app/
├─ app/
│  ├─ [locale]/
│  │  ├─ page.tsx                 # home generator
│  │  ├─ [type]-qr-code/page.tsx  # SEO pages (wifi, vcard...)
│  │  ├─ pricing/page.tsx
│  │  ├─ dashboard/page.tsx
│  │  └─ layout.tsx
│  ├─ r/[slug]/route.ts           # dynamic QR redirect + scan log
│  └─ api/
│     ├─ qr/route.ts
│     ├─ bulk/route.ts
│     └─ webhooks/route.ts
├─ components/
│  ├─ generator/ (TypeTabs, ContentForm, DesignPanel, Preview, DownloadBar)
│  ├─ forms/ (Url, Wifi, VCard, Sms, Email, Location, Event, Payment)
│  └─ ui/
├─ lib/
│  ├─ qr/ (builders.ts, styling.ts, export.ts)
│  ├─ db.ts
│  └─ i18n/
├─ store/useQrStore.ts
├─ messages/ (en.json, bn.json)
├─ prisma/schema.prisma
├─ public/ (logos, templates)
└─ Dockerfile
```

## 7. Payload Formats
- URL: `https://example.com`
- WiFi: `WIFI:T:WPA;S:ssid;P:password;;`
- Email: `mailto:a@b.com?subject=Hi&body=Text`
- SMS: `SMSTO:+8801XXXXXXXXX:message`
- Phone: `tel:+8801XXXXXXXXX`
- Geo: `geo:23.8103,90.4125`
- vCard: `BEGIN:VCARD ... END:VCARD`
- Event: `BEGIN:VEVENT ... END:VEVENT`
- WhatsApp: `https://wa.me/8801XXXXXXXXX?text=Hi`

## 8. Database (v3)
```
User(id, email, plan)
QrCode(id, userId, type, slug, targetUrl, design JSON, createdAt)
Scan(id, qrId, ts, country, device, os, referrer)
```

## 9. Dynamic QR Flow
QR encodes `https://yourdomain/r/abc123` -> route handler looks up slug -> logs scan async -> 302 redirect to target. Edit target anytime without reprinting.

## 10. SEO Plan
- One landing page per type with H1, short intro, tool, FAQ (FAQ schema)
- Bangla pages (e.g. বাংলা কিউআর কোড জেনারেটর)
- Sitemap, canonical, hreflang, fast LCP (lazy-load PDF libs)

## 11. Monetization
Free static; pay-per-code (e.g. ৳1 after free quota) or monthly plan; bKash/Nagad/SSLCommerz for BD, Stripe for international.

## 12. Setup
```bash
npx create-next-app@latest qr-app --ts --tailwind --app
cd qr-app
npm i qr-code-styling zustand next-intl jspdf
npx shadcn@latest init
```

## 13. Launch Checklist
- [ ] Scan-test on iOS and Android
- [ ] Contrast + logo-size validation
- [ ] Mobile layout
- [ ] Privacy page (static data never leaves browser)
- [ ] Rate limiting on redirect/API
- [ ] Analytics and sitemap submitted

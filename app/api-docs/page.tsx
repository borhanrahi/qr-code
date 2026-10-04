import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { StudioBackdrop } from "@/components/generator/generator-hero";
import { Badge } from "@/components/ui/badge";
import { ApiDocsClient } from "@/components/docs/api-docs-client";

export const metadata: Metadata = {
  title: "API & Docs — ScanCraft",
  description:
    "Generate QR codes from your own apps: REST endpoints for QR rendering, dynamic codes and scan analytics, with a live playground.",
};

export default function ApiDocsPage() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="w-full pt-16 bg-surface-bg min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="relative w-full overflow-hidden">
          <StudioBackdrop />
          <PageHero
            icon="code"
            eyebrow="DEVELOPER PLATFORM"
            title="API & Docs"
            description="Ship QR codes from your own stack. One REST endpoint renders SVG/PNG server-side; dynamic endpoints manage short links and their scan analytics."
            actions={
              <>
                <Badge tone="sky" mono>
                  REST · JSON
                </Badge>
                <Badge tone="teal" mono>
                  SVG + PNG
                </Badge>
                <Badge tone="emerald" mono>
                  Live Playground
                </Badge>
              </>
            }
          />
        </div>

        <ApiDocsClient />
      </main>

      <SiteFooter />
    </div>
  );
}

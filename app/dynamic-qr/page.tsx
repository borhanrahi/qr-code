import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { StudioBackdrop } from "@/components/generator/generator-hero";
import { Badge } from "@/components/ui/badge";
import { DynamicStudio } from "@/components/dynamic/dynamic-studio";

export const metadata: Metadata = {
  title: "Dynamic QR & Analytics — ScanCraft",
  description:
    "Create dynamic QR codes with editable destinations and track scans by time, device, OS and country.",
};

export default function DynamicQrPage() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="w-full pt-16 bg-surface-bg min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="relative w-full overflow-hidden">
          <StudioBackdrop />
          <PageHero
            icon="query_stats"
            eyebrow="V3 TELEMETRY SUITE"
            title="Dynamic QR & Analytics"
            description="Print once, redirect anywhere. Every scan is logged with device, OS and country — edit the destination of any code without reprinting a thing."
            actions={
              <>
                <Badge tone="emerald" mono>
                  Editable URL
                </Badge>
                <Badge tone="sky" mono>
                  Scan Logging
                </Badge>
                <Badge tone="teal" mono>
                  7-Day Charts
                </Badge>
              </>
            }
          />
        </div>

        <DynamicStudio />
      </main>

      <SiteFooter />
    </div>
  );
}

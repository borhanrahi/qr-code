import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { StudioBackdrop } from "@/components/generator/generator-hero";
import { Badge } from "@/components/ui/badge";
import { BulkStudio } from "@/components/bulk/bulk-studio";

export const metadata: Metadata = {
  title: "Bulk CSV QR Generator — ScanCraft",
  description:
    "Upload or paste a CSV of links and generate hundreds of QR codes at once, with batch PNG export.",
};

export default function BulkCsvPage() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="w-full pt-16 bg-surface-bg min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="relative w-full overflow-hidden">
          <StudioBackdrop />
          <PageHero
            icon="table_view"
            eyebrow="V2 BULK ENGINE"
            title="Bulk CSV Generator"
            description="Drop in a CSV of links — or any QR payload — review every row, and export the whole batch as PNGs styled with your studio design."
            actions={
              <>
                <Badge tone="sky" mono>
                  CSV / TSV
                </Badge>
                <Badge tone="teal" mono>
                  Batch PNG Export
                </Badge>
                <Badge tone="emerald" mono>
                  Round-trip CSV
                </Badge>
              </>
            }
          />
        </div>

        <BulkStudio />
      </main>

      <SiteFooter />
    </div>
  );
}

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GeneratorHero, StudioBackdrop } from "@/components/generator/generator-hero";
import { TypeTabs } from "@/components/generator/type-tabs";
import { Workspace } from "@/components/generator/workspace";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="w-full pt-16 bg-surface-bg min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="relative w-full overflow-hidden">
          <StudioBackdrop />
          <GeneratorHero />
        </div>

        <TypeTabs />
        <Workspace />
      </main>

      <SiteFooter />
    </div>
  );
}

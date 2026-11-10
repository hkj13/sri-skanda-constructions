import { Cursor } from "@/components/site/Cursor";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteMotion } from "@/components/site/SiteMotion";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { UnderLayers } from "@/home/client";
import { navItems } from "@/lib/nav";
import { businessJsonLd, ldScript } from "@/lib/seo";
import { telLink } from "@/lib/whatsapp";
import { SceneHost } from "@/scene/SceneHost";
import { tr } from "@content/i18n";
import { site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const items = navItems();
  const whatsapp = whatsappUrl(tr(ui.whatsappGreeting));
  return (
    // Navy drawing paper for every page, as an ordinary background, so
    // light text always has its dark ground. Light sections bring their
    // own. The drawing grid is a fixed layer on top of it, so it stays put
    // like paper under glass, and the home story's stage lines up with it.
    // The fixed layers below paint above the grid and beneath the page
    // content, in this order: dusk, footage, 3D model.
    <div className="min-h-svh bg-primary">
      <div aria-hidden="true" className="bp-grid pointer-events-none fixed inset-0" />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-primary"
      >
        {tr(ui.skipToContent)}
      </a>
      <SiteMotion />
      <Header
        items={items}
        labels={{
          plan: tr(ui.cta.plan),
          menu: tr(ui.nav.menu),
          close: tr(ui.nav.close),
          main: tr(ui.nav.main),
          whatsapp: tr(ui.cta.whatsapp),
          call: tr(ui.cta.call),
        }}
        whatsappHref={whatsapp}
        telHref={telLink}
        phone={site.phone.display}
        siteName={site.name}
      />
      <UnderLayers />
      {/* The building model: one canvas that stays mounted across pages. */}
      <SceneHost />
      <main id="content" tabIndex={-1} className="relative outline-none">
        {children}
      </main>
      <Footer items={items} />
      <WhatsAppFab href={whatsapp} label={tr(ui.cta.chatLabel)} />
      <Cursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldScript(businessJsonLd()) }}
      />
    </div>
  );
}

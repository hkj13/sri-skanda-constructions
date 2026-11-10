import { Cursor } from "@/components/site/Cursor";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteMotion } from "@/components/site/SiteMotion";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
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
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-primary"
      >
        {tr(ui.skipToContent)}
      </a>
      {/* Navy drawing paper behind every page. Sections that need a light
          ground bring their own; the 3D canvas sits between this and them. */}
      <div aria-hidden="true" className="bp-grid fixed inset-0 -z-10 bg-primary" />
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
    </>
  );
}

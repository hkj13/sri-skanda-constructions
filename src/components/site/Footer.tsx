import Link from "next/link";
import { Logo } from "@/brand/Logo";
import { PhoneIcon, PinIcon, SocialIcon, WhatsAppIcon } from "@/components/ui/icons";
import { tr } from "@content/i18n";
import { addressLines, mapLinks, site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";
import type { NavItem } from "./Header";

const SOCIAL_NAMES = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
} as const;

export function Footer({ items }: { items: NavItem[] }) {
  const [line1, line2] = addressLines();
  const socials = (Object.keys(SOCIAL_NAMES) as (keyof typeof SOCIAL_NAMES)[]).filter(
    (k) => site.social[k],
  );
  const heading = "t-eyebrow text-accent";
  const link =
    "underline-offset-4 hover:text-accent hover:underline focus-visible:outline-accent";

  return (
    <footer className="relative bg-navy-950 text-white">
      <div className="shell grid gap-x-[var(--gutter)] gap-y-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <Logo kind="stacked" variant="dark" title={site.name} className="h-auto w-44" />
          <p className="mt-6 max-w-sm text-white/85">{tr(ui.footer.tagline)}</p>
        </div>

        <div className="lg:col-span-3">
          <h2 className={heading}>{tr(ui.footer.visit)}</h2>
          <address className="mt-4 not-italic leading-relaxed text-white/90">
            {line1}
            <br />
            {line2}
            <br />
            {site.address.country}
          </address>
          <a
            href={mapLinks().directions}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-4 inline-flex items-center gap-2 font-medium ${link}`}
          >
            <PinIcon className="h-5 w-5 text-accent" />
            {tr(ui.cta.directions)}
          </a>
        </div>

        <div className="lg:col-span-3">
          <h2 className={heading}>{tr(ui.footer.talk)}</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={`tel:${site.phone.e164}`} className={`inline-flex items-center gap-2 ${link}`}>
                <PhoneIcon className="h-5 w-5 text-accent" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(tr(ui.whatsappGreeting))}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-cta=""
                className={`inline-flex items-center gap-2 ${link}`}
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                {tr(ui.cta.whatsapp)}
              </a>
            </li>
            {site.email ? (
              <li>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
            ) : null}
          </ul>
          {socials.length ? (
            <>
              <h2 className={`${heading} mt-8`}>{tr(ui.footer.follow)}</h2>
              <ul className="mt-4 flex gap-4">
                {socials.map((k) => (
                  <li key={k}>
                    <a
                      href={site.social[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_NAMES[k]}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:border-accent hover:text-accent focus-visible:outline-accent"
                    >
                      <SocialIcon name={k} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <nav aria-label={tr(ui.footer.explore)} className="lg:col-span-2">
          <h2 className={heading}>{tr(ui.footer.explore)}</h2>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-secondary">
        <div className="shell flex flex-col gap-2 py-6 text-white/80 t-small sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {tr(ui.footer.rights)}
          </p>
          {site.reraNumber ? (
            <p className="t-tech text-navy-300">
              {tr(ui.footer.rera)}: {site.reraNumber}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

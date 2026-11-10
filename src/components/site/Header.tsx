"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/brand/Logo";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

export type NavItem = { href: string; label: string };

type Props = {
  items: NavItem[];
  labels: { plan: string; menu: string; close: string; main: string; whatsapp: string; call: string };
  whatsappHref: string;
  telHref: string;
  phone: string;
  siteName: string;
};

/**
 * Site header. Transparent over the navy top of each page, solid navy once
 * anything scrolls beneath it, so it never sits on display type. It slides
 * away on scroll down and returns on scroll up or keyboard focus.
 */
export function Header({ items, labels, whatsappHref, telHref, phone, siteName }: Props) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setSolid(y > 12);
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 200);
        last = y;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after a navigation.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={`site-header fixed inset-x-0 top-[var(--laser-h)] z-50 text-white transition-[transform,background-color] duration-300 ease-out motion-reduce:transition-none ${
        hidden ? "-translate-y-[120%]" : "translate-y-0"
      } ${solid ? "bg-primary shadow-[0_1px_0_0_var(--secondary)]" : "bg-transparent"}`}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${siteName}, home`}
          className="flex shrink-0 items-center focus-visible:outline-accent"
        >
          <Logo kind="horizontal" variant="dark" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav aria-label={labels.main} className="hidden lg:block">
          <ul className="flex items-center gap-[clamp(1.25rem,2.2vw,2.75rem)] text-[1rem] font-medium">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="relative py-2 text-white underline-offset-8 hover:text-accent focus-visible:outline-accent aria-[current=page]:text-accent aria-[current=page]:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-full bg-accent px-5 text-[1rem] font-semibold text-primary transition-colors hover:bg-accent-light focus-visible:outline-accent sm:inline-flex"
          >
            {labels.plan}
          </Link>
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-haspopup="dialog"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white hover:border-accent hover:text-accent focus-visible:outline-accent lg:hidden"
          >
            <span className="sr-only">{labels.menu}</span>
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-label={labels.menu}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-primary p-0 text-white backdrop:bg-primary lg:hidden"
      >
        <div className="bp-grid flex min-h-full flex-col px-[var(--margin)] pb-8">
          <div className="flex h-[calc(var(--header-h)+var(--laser-h))] items-center justify-between">
            <Logo kind="horizontal" variant="dark" className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:border-accent hover:text-accent focus-visible:outline-accent"
            >
              <span className="sr-only">{labels.close}</span>
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label={labels.main} className="mt-6 flex-1">
            <ul>
              {items.map((item) => (
                <li key={item.href} className="border-b border-secondary">
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    onClick={() => dialog.current?.close()}
                    className="block py-4 text-[1.75rem] font-light leading-tight focus-visible:outline-accent aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 grid gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-primary focus-visible:outline-accent"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {labels.whatsapp}
            </a>
            <a
              href={telHref}
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full border border-white/60 px-6 py-3.5 font-semibold focus-visible:outline-accent"
            >
              <PhoneIcon className="h-5 w-5" />
              {labels.call} {phone}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}

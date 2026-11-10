"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp button, bottom right on every page.
 *
 * It steps aside whenever a WhatsApp button that belongs to the page itself
 * is on screen (anything marked data-wa-cta), so the two never overlap and
 * the corner is never doubled up.
 */
export function WhatsAppFab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [away, setAway] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setAway(visible.size > 0);
      },
      { threshold: 0.6 },
    );
    const watch = () => {
      document.querySelectorAll("[data-wa-cta]").forEach((el) => io.observe(el));
    };
    watch();
    // Pages add their buttons after navigation.
    const t = window.setTimeout(watch, 600);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return (
    <aside aria-label="Quick contact">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      tabIndex={away ? -1 : 0}
      aria-hidden={away ? true : undefined}
      className={`fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-primary shadow-[0_6px_20px_-4px_rgba(18,24,43,0.55)] ring-2 ring-primary transition-[transform,opacity] duration-200 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none ${
        away ? "pointer-events-none scale-75 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
    </aside>
  );
}

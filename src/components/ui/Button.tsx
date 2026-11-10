import Link from "next/link";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "./icons";

export type ButtonVariant =
  | "whatsapp"
  | "lime"
  | "navy"
  | "outline-light"
  | "outline-dark";

const VARIANTS: Record<ButtonVariant, string> = {
  // WhatsApp green always carries navy text: white on it fails contrast.
  whatsapp: "bg-whatsapp text-primary hover:bg-[#3fe07a]",
  lime: "bg-accent text-primary hover:bg-accent-light",
  navy: "bg-primary text-white hover:bg-secondary",
  "outline-light":
    "border border-white/60 text-white hover:border-accent hover:text-accent",
  "outline-dark":
    "border border-primary/50 text-primary hover:border-primary hover:bg-primary hover:text-white",
};

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[1rem] font-semibold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4";

type Props = {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  /** Opens in a new tab (WhatsApp, maps). */
  external?: boolean;
  /** Adds the WhatsApp glyph. */
  whatsappIcon?: boolean;
  "aria-label"?: string;
};

export function ButtonLink({
  href,
  variant = "lime",
  children,
  className = "",
  external,
  whatsappIcon,
  ...rest
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  const content = (
    <>
      {whatsappIcon ? <WhatsAppIcon className="h-5 w-5 shrink-0" /> : null}
      <span>{children}</span>
    </>
  );
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    const newTab = external ?? href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        // Lets the floating WhatsApp button step aside while this one is on screen.
        {...(variant === "whatsapp" ? { "data-wa-cta": "" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

/** The standard WhatsApp button, with an optional prefilled message. */
export function WhatsAppButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ButtonLink href={href} variant="whatsapp" external whatsappIcon className={className}>
      {children}
    </ButtonLink>
  );
}

import Link from "next/link";
import { Logo } from "@/brand/Logo";
import { tr } from "@content/i18n";
import { ui } from "@content/ui";

export default function NotFound() {
  return (
    <main className="bp-grid flex min-h-svh flex-col bg-primary text-white">
      <div className="shell py-8">
        <Link href="/" aria-label="Sri Skanda Constructions, home" className="inline-block focus-visible:outline-accent">
          <Logo kind="horizontal" variant="dark" className="h-10 w-auto" />
        </Link>
      </div>
      <div className="shell flex flex-1 flex-col justify-center pb-24">
        <p className="t-tech text-accent">Error 404 · Sheet not found</p>
        <h1 className="t-h1 mt-5 max-w-[16ch]">{tr(ui.notFound.title)}</h1>
        <p className="t-lead mt-6 max-w-[40ch] text-white/90">{tr(ui.notFound.body)}</p>
        <p className="mt-10">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-primary hover:bg-accent-light focus-visible:outline-accent">
            {tr(ui.notFound.home)}
          </Link>
        </p>
      </div>
    </main>
  );
}

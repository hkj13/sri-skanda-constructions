import { tr } from "@content/i18n";
import { packages } from "@content/packages";
import { projects } from "@content/projects";
import { ui } from "@content/ui";

/** Menu links. Projects and Packages appear only once they have content. */
export function navItems(): { href: string; label: string }[] {
  return [
    { href: "/services", label: tr(ui.nav.services) },
    { href: "/process", label: tr(ui.nav.process) },
    ...(projects.length ? [{ href: "/projects", label: tr(ui.nav.projects) }] : []),
    ...(packages.length ? [{ href: "/packages", label: tr(ui.nav.packages) }] : []),
    { href: "/estimate", label: tr(ui.nav.estimate) },
    { href: "/about", label: tr(ui.nav.about) },
    { href: "/contact", label: tr(ui.nav.contact) },
  ];
}

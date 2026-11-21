"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBook, IconCart, IconCycle, IconHome } from "./Icons";
import { lijstStore } from "@/lib/mijn";

const TABS = [
  { href: "/app", label: "Vandaag", Icon: IconHome },
  { href: "/app/fases", label: "Fases", Icon: IconCycle },
  { href: "/app/lijstje", label: "Lijstje", Icon: IconCart },
  { href: "/app/fruitboek", label: "Fruitboek", Icon: IconBook },
];

export default function TabBar() {
  const path = usePathname();
  const lijst = lijstStore.useHook();
  const open = lijst.filter((i) => !i.klaar).length;
  if (path === "/app/welkom") return null;
  return (
    <nav aria-label="Tabbalk" className="tabbar">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/app" ? path === "/app" : path.startsWith(href);
        return (
          <Link key={href} href={href} className="tab" aria-current={active ? "page" : undefined} style={{ position: "relative" }}>
            <span data-tab={href === "/app/fruitboek" ? "fruitboek" : undefined} style={{ display: "inline-flex" }}><Icon /></span>
            {label}
            {href === "/app/lijstje" && open > 0 ? <b className="tab-badge" aria-label={`${open} nog te halen`}>{open}</b> : null}
          </Link>
        );
      })}
    </nav>
  );
}

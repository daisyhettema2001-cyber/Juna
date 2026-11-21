"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CycleRing from "@/components/CycleRing";
import FruitRain from "@/components/FruitRain";
import { IconSparkle, IconWave } from "@/components/Icons";
import { computeToday, useCycle } from "@/lib/cycle";
import { getPhase, getRecipe } from "@/lib/data";
import { tipLink, weekTips } from "@/lib/tips";
import { useVoorkeuren } from "@/lib/voorkeuren";

const fmt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long" });

export default function Vandaag() {
  const cycle = useCycle();
  const router = useRouter();
  const { uitgesloten } = useVoorkeuren();

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const { day, phase: phaseId, daysToPeriod } = computeToday(cycle);
  const phase = getPhase(phaseId);
  const recipe = getRecipe(phase.recipes[0])!;
  const raw = fmt.format(new Date());
  const today = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <main className="app-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>{today}</span>
          <h1 className="display" style={{ fontSize: 28 }}>Hoi!</h1>
        </div>
        <Link
          href="/app/koppelen"
          aria-label="Cyclus instellen"
          className="icon-btn"
          style={{ background: "var(--violet-t)", color: "var(--violet-d)", fontWeight: 800 }}
        >
          J
        </Link>
      </div>

      <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <CycleRing day={day} cycleLength={cycle.cycleLength} periodLength={cycle.periodLength} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="chip" style={{ alignSelf: "flex-start", background: phase.tint, color: phase.dark, fontSize: 12 }}>
            {phase.label}
          </span>
          <span style={{ fontSize: 15, lineHeight: 1.4 }}>{phase.body}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {phaseId === "menstruatie"
              ? `Dag ${day} van je menstruatie`
              : `Menstruatie over ± ${daysToPeriod} ${daysToPeriod === 1 ? "dag" : "dagen"}`}
          </span>
          {cycle.irregular ? <span style={{ fontSize: 12, color: "var(--muted)" }}>Je cyclus varieert, dus dit is een inschatting.</span> : null}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20 }}>Jouw {recipe.kind === "smoothie" ? "smoothie" : "sap"} van deze week</h2>
        <div className="fr-card" style={{ background: phase.tint, color: "#2E1428" }}>
          <FruitRain key={uitgesloten.join(",")} phase={{ ...phase, recipeName: recipe.name }} uitgesloten={uitgesloten} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {weekTips(phaseId, uitgesloten).map((tip, i) => {
            const link = tipLink(tip);
            const kleur = i === 0 ? "var(--orange-d)" : "var(--green-d)";
            const stijl = { textDecoration: "none", color: "inherit", background: i === 0 ? "var(--orange-t)" : "var(--green-t)", borderRadius: 22, padding: 14, display: "flex", flexDirection: "column" as const, gap: 6 };
            const inhoud = (
              <>
                {i === 0 ? <IconSparkle size={22} color={kleur} /> : <IconWave size={22} color={kleur} />}
                <span className="eyebrow" style={{ color: kleur }}>{tip.soort}</span>
                <span style={{ fontSize: 13, lineHeight: 1.35 }}>{tip.tekst}</span>
              </>
            );
            return link ? (
              <Link key={tip.tekst} href={link} style={stijl}>{inhoud}</Link>
            ) : (
              <div key={tip.tekst} style={stijl}>{inhoud}</div>
            );
          })}
        </div>
        <span style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>Elke week nieuwe tips. Juna geeft geen medisch advies.</span>
      </div>
    </main>
  );
}

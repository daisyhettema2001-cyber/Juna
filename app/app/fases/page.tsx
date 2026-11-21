"use client";

import { useEffect, useState } from "react";
import { PhaseIcon } from "@/components/Icons";
import { computeToday, phaseRanges, useCycle } from "@/lib/cycle";
import { PHASES, type PhaseId } from "@/lib/data";

export default function Fases() {
  const cycle = useCycle();
  const [picked, setPicked] = useState<PhaseId>("luteaal");
  const [current, setCurrent] = useState<PhaseId | null>(null);

  useEffect(() => {
    if (cycle) {
      const ph = computeToday(cycle).phase;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPicked(ph);
      setCurrent(ph);
    }
  }, [cycle]);

  const ranges = phaseRanges(cycle?.cycleLength ?? 28, cycle?.periodLength ?? 5);
  const days = (id: PhaseId) => `dag ${ranges[id][0]}–${ranges[id][1]}`;
  const p = PHASES.find((x) => x.id === picked)!;

  return (
    <main className="app-main" style={{ gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 className="display" style={{ fontSize: 30 }}>Jouw cyclus</h1>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Tik op een fase om te zien wat je lichaam doet.</p>
      </div>

      <div className="phase-pills" role="group" aria-label="Kies een fase">
        {PHASES.map((x) => {
          const on = x.id === picked;
          return (
            <button
              key={x.id}
              type="button"
              className="phase-pill"
              aria-pressed={on}
              onClick={() => setPicked(x.id)}
              style={{ borderColor: x.color, background: on ? x.color : "#fff", color: on ? "#fff" : x.dark }}
            >
              <span style={{ fontSize: 12, fontWeight: 700 }}>{x.short}</span>
              <span style={{ fontSize: 10 }}>{days(x.id)}</span>
            </button>
          );
        })}
      </div>

      <section style={{ background: p.tint, borderRadius: 26, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="phase-icon" style={{ background: p.color, width: 40, height: 40 }}>
              <PhaseIcon id={p.id} color="#fff" size={20} />
            </span>
            <h2 className="display" style={{ fontSize: 24 }}>{p.name}</h2>
          </div>
          {current === p.id && (
            <span className="chip" style={{ background: "#fff", color: p.dark, fontSize: 12 }}>Nu</span>
          )}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.45 }}>{p.body}</p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className="eyebrow" style={{ color: p.dark }}>Energie</span>
          <span style={{ display: "flex", gap: 4 }} aria-label={`Energie ${p.energy} van 4`} role="img">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} style={{ width: 18, height: 8, borderRadius: 4, background: n <= p.energy ? p.color : "#fff" }} />
            ))}
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{p.hormone}</span>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 12, fontSize: 13, lineHeight: 1.4 }}>
          <strong style={{ display: "block", marginBottom: 4 }}>Huid</strong>
          {p.skin}
        </div>
      </section>

      <section style={{ background: p.tint, borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <h2 style={{ fontWeight: 700, fontSize: 17, color: p.dark }}>Waar Juna op let</h2>
        <p style={{ fontSize: 14, lineHeight: 1.45 }}>{p.focus}</p>
        <p style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Je sapje van de week verschijnt zodra deze fase begint. Jij bepaalt mee.
        </p>
      </section>
    </main>
  );
}

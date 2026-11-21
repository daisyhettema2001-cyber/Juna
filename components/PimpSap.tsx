"use client";

import { useState } from "react";
import { ING } from "@/lib/ingredients";
import { kiesPimp, type ExtraDoel } from "@/lib/extras";
import { extraStore, zetOpLijst } from "@/lib/mijn";

const NAMEN: Record<ExtraDoel, string> = { huid: "Huid", haar: "Haar" };

export default function PimpSap({ set, uitgesloten, machine, kleur }: { set: string[]; uitgesloten: string[]; machine: "beide" | "mixer" | "slowjuicer"; kleur: string }) {
  const doel = extraStore.useHook();
  const [status, setStatus] = useState("");
  const tip = doel ? kiesPimp(doel, set, uitgesloten, machine) : null;

  return (
    <div style={{ borderRadius: 18, background: "rgba(255,255,255,.7)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <strong style={{ fontSize: 15, color: kleur }}>Pimp je sapje</strong>
        <div className="segmented" role="group" aria-label="Kies waarvoor je een tip wilt">
          {(["huid", "haar"] as ExtraDoel[]).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={doel === d}
              onClick={() => {
                extraStore.bewaar(doel === d ? null : d);
                setStatus("");
              }}
            >
              {NAMEN[d]}
            </button>
          ))}
        </div>
      </div>
      {!doel ? (
        <span style={{ fontSize: 13, lineHeight: 1.45 }}>Kies huid of haar en krijg een tip om iets bij dit sapje te doen.</span>
      ) : tip ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span className="dot" style={{ width: 26, height: 26, flex: "none", background: ING[tip.id].kleur, marginTop: 1 }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <strong style={{ fontSize: 14.5 }}>Tip voor je {doel === "huid" ? "huid" : "haar"}: voeg {ING[tip.id].naam.toLowerCase()} toe</strong>
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>{tip.reden}</span>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-light"
            style={{ minHeight: 42, borderRadius: 14, fontSize: 14 }}
            onClick={() => setStatus(zetOpLijst([tip.id], "Extra") ? "Op je boodschappenlijstje gezet." : "Stond al op je lijstje.")}
          >
            Zet op lijstje
          </button>
          <span role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 16 }}>{status}</span>
        </div>
      ) : (
        <span style={{ fontSize: 13, lineHeight: 1.45 }}>Voor dit sapje heb ik nu geen tip. Schud het sapje voor een andere combinatie.</span>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCycle } from "@/lib/cycle";
import { PHASES, getPhase, getRecipe } from "@/lib/data";
import { AMT, ING, fasesMet } from "@/lib/ingredients";
import { bewaardStore, boekStore, logStore, zetNotitie, type LogItem } from "@/lib/mijn";

const datumFmt = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" });
const logFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" });
const dagTekst = (iso: string) => {
  const t = logFmt.format(new Date(iso + "T00:00:00")).replace(".", "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const BEREIDING: Record<string, string> = {
  pers: "Persen in een slowjuicer, of mixen in een blender.",
  mix: "Mixen in de blender. Geeft geen sap in een slowjuicer.",
  toevoegen: "Roer het door je sapje of mix het mee.",
};

type Deel = "log" | "gids" | "bewaard";

export default function MijnSapjes() {
  const router = useRouter();
  const cycle = useCycle();
  const boek = boekStore.useHook();
  const bewaard = bewaardStore.useHook();
  const log = logStore.useHook();
  const [deel, setDeel] = useState<Deel>("log");
  const [open, setOpen] = useState<string | null>(null);
  const [bewerk, setBewerk] = useState<string | null>(null);
  const [tekst, setTekst] = useState("");

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const alle = Object.values(ING).sort((a, b) => a.naam.localeCompare(b.naam, "nl"));
  const totaal = alle.length;
  const titel = deel === "log" ? "Mijn sapjes" : deel === "gids" ? "Mijn sapjes" : "Mijn sapjes";

  const nieuwste = [...log].sort((a, b) => b.dag.localeCompare(a.dag));
  const sleutelVan = (x: LogItem) => `${x.dag}|${[...x.ids].sort().join(",")}`;
  const groepen: { phase: LogItem["phase"]; items: LogItem[] }[] = [];
  nieuwste.forEach((x) => {
    const laatste = groepen[groepen.length - 1];
    if (laatste && laatste.phase === x.phase) laatste.items.push(x);
    else groepen.push({ phase: x.phase, items: [x] });
  });

  const opSoort = (id: string) => log.filter((x) => x.ids.includes(id)).sort((a, b) => b.dag.localeCompare(a.dag));

  function naarGids(id: string) {
    setOpen(id);
    setDeel("gids");
    window.scrollTo(0, 0);
  }

  function slaOp(x: LogItem) {
    zetNotitie(x, tekst);
    setBewerk(null);
  }

  return (
    <main className="app-main mijn">
      <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>{titel}</h1>
      <div className="seg3" role="group" aria-label="Kies een onderdeel">
        <button type="button" aria-pressed={deel === "log"} onClick={() => setDeel("log")}>Logboek</button>
        <button type="button" aria-pressed={deel === "gids"} onClick={() => { setDeel("gids"); setOpen(null); }}>Gids</button>
        <button type="button" aria-pressed={deel === "bewaard"} onClick={() => setDeel("bewaard")}>Bewaard</button>
      </div>

      {deel === "log" ? (
        <>
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{boek.length} van {totaal} ingrediënten geprobeerd</span>
          {nieuwste.length === 0 ? (
            <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
              Nog niets in je logboek. Tik bij je sapje op Gemaakt ✓, dan komt het hier te staan.
            </p>
          ) : (
            groepen.map((g, gi) => {
              const p = getPhase(g.phase);
              return (
                <section key={gi} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="lg-kop" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: p.dark }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                    {PHASES.find((f) => f.id === g.phase)?.name}
                  </div>
                  {g.items.map((x) => {
                    const k = sleutelVan(x);
                    return (
                      <div key={k} className="card" style={{ borderRadius: 16, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <strong className="lg-kop" style={{ fontSize: 16 }}>{dagTekst(x.dag)}</strong>
                          <span style={{ display: "flex", gap: 4 }} aria-hidden="true">
                            {x.ids.map((id) => (
                              <span key={id} style={{ width: 12, height: 12, borderRadius: "50%", background: ING[id].kleur, display: "inline-block" }} />
                            ))}
                          </span>
                        </div>
                        <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)" }}>
                          {x.ids.map((id, i) => (
                            <span key={id}>
                              <button type="button" className="lg-link" onClick={() => naarGids(id)}>{ING[id].naam}</button>
                              {i < x.ids.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </span>
                        <input
                          type="text"
                          className="lg-input"
                          maxLength={80}
                          aria-label="Notitie bij dit sapje"
                          placeholder="Notitie toevoegen"
                          value={bewerk === k ? tekst : x.note ?? ""}
                          onFocus={() => {
                            setTekst(x.note ?? "");
                            setBewerk(k);
                          }}
                          onChange={(e) => setTekst(e.target.value)}
                          onBlur={() => slaOp(x)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                        />
                      </div>
                    );
                  })}
                </section>
              );
            })
          )}
        </>
      ) : deel === "gids" ? (
        open ? (
          (() => {
            const i = ING[open];
            const gebruikt = opSoort(open);
            const fases = fasesMet(open).map((f) => PHASES.find((p) => p.id === f)?.name).filter(Boolean).join(", ");
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button type="button" className="lg-link" style={{ alignSelf: "flex-start", fontSize: 14 }} onClick={() => setOpen(null)}>← Alle ingrediënten</button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 64, height: 64, borderRadius: 16, background: `${i.kleur}26`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/fruit/${i.id}.svg`} alt="" style={{ width: 48, height: 48 }} />
                  </span>
                  <div>
                    <h2 className="display" style={{ fontSize: 24, lineHeight: 1.1 }}>{i.naam}</h2>
                    <span style={{ fontSize: 13, color: "var(--ink-2)", textTransform: "capitalize" }}>{i.soort}</span>
                  </div>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.5 }}>{i.reden}</p>
                {i.waarschuwing ? <p style={{ fontSize: 13, lineHeight: 1.45, fontStyle: "italic", color: "var(--ink-2)" }}>{i.waarschuwing}</p> : null}
                <div className="card" style={{ borderRadius: 16, padding: "4px 14px" }}>
                  {[
                    ["Past bij", fases || "Geen vaste fase"],
                    ["Bereiding", i.bereiding ? BEREIDING[i.bereiding] : "Mixen in de blender."],
                    ["In een sapje", AMT[i.id] ?? "Naar smaak"],
                    ["Gebruikt door jou", gebruikt.length ? `${gebruikt.length} ${gebruikt.length === 1 ? "keer" : "keer"}, laatst op ${datumFmt.format(new Date(gebruikt[0].dag + "T00:00:00"))}` : "Nog niet gemaakt"],
                  ].map(([a, b]) => (
                    <div key={a} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid #f1e7ee", fontSize: 14 }}>
                      <span style={{ color: "var(--ink-2)" }}>{a}</span>
                      <span style={{ textAlign: "right", maxWidth: "62%" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 6 }}>Tik op een ingrediënt voor meer.</span>
            {alle.map((i) => (
              <button key={i.id} type="button" className="gd-rij" onClick={() => setOpen(i.id)}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: `${i.kleur}26`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/fruit/${i.id}.svg`} alt="" style={{ width: 30, height: 30 }} />
                </span>
                <span style={{ flex: 1, textAlign: "left", fontWeight: 600 }}>{i.naam}</span>
                {boek.includes(i.id) ? <span style={{ fontSize: 12, color: "var(--ink-2)" }}>Geprobeerd</span> : null}
              </button>
            ))}
          </div>
        )
      ) : bewaard.length === 0 ? (
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
          Nog niets bewaard. Tik op het hartje bij een sapje dat je lekker vindt.
        </p>
      ) : (
        <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column" }}>
          {[...bewaard].reverse().map((b) => {
            const p = getPhase(b.phase);
            return (
              <div key={`${b.datum}-${b.ids.join()}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1e7ee" }}>
                <div style={{ display: "flex" }}>
                  {b.ids.map((id) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={id} src={`/fruit/${id}.svg`} alt={ING[id].naam} style={{ width: 38, height: 38, marginRight: -8 }} />
                  ))}
                </div>
                <span style={{ flex: 1, paddingLeft: 10, display: "flex", flexDirection: "column" }}>
                  <strong style={{ color: p.dark }}>{getRecipe(p.recipes[0])?.name ?? p.label}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Bewaard op {datumFmt.format(new Date(b.datum + "T00:00:00"))}</span>
                </span>
                <button
                  type="button"
                  aria-label="Haal weg uit bewaard"
                  onClick={() => bewaardStore.bewaar(bewaard.filter((x) => x !== b))}
                  style={{ border: "none", background: "none", fontSize: 24, color: "var(--berry)", cursor: "pointer", minWidth: 44, minHeight: 44 }}
                >
                  ♥
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

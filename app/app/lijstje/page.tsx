"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { computeToday, useCycle } from "@/lib/cycle";
import { getPhase, getRecipe } from "@/lib/data";
import { AMT, ING, weekId } from "@/lib/ingredients";
import { hoeveelheid, BEWAAR } from "@/lib/porties";
import { lijstStore, portiesStore, schudVolgende, vastStore, volgendeSet, volgendeStore, weekOver, zetOpLijst, type LijstItem } from "@/lib/mijn";
import { useVoorkeuren } from "@/lib/voorkeuren";

function Rij({ set }: { set: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {set.map((id) => (
        <div key={id} className="lj-li" style={{ cursor: "default" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/fruit/${id}.svg`} alt="" />
          <span className="lj-n">
            {ING[id].naam}
            <small>{AMT[id]}</small>
            <small style={{ fontSize: 13, lineHeight: 1.4, color: "var(--ink)", marginTop: 2 }}>{ING[id].reden}</small>
            {ING[id].waarschuwing ? <small style={{ fontSize: 12, lineHeight: 1.35, fontStyle: "italic", marginTop: 2 }}>{ING[id].waarschuwing}</small> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function bronNaam(b: string): string {
  if (b === "Extra") return "voor je extra";
  const week = b.split(":")[0];
  if (week === weekId()) return "deze week";
  if (week === weekId(weekOver(7))) return "volgende week";
  return "andere week";
}

function bewaarMachine(): "mixer" | "slowjuicer" | "beide" {
  try {
    const m = localStorage.getItem("juna.machine.v1");
    if (m === "mixer" || m === "slowjuicer") return m;
  } catch {
    /* ignore */
  }
  return "beide";
}

export default function Lijstje() {
  const router = useRouter();
  const cycle = useCycle();
  const { uitgesloten } = useVoorkeuren();
  const vast = vastStore.useHook();
  const lijst = lijstStore.useHook();
  const opgeslagen = volgendeStore.useHook();
  const sapjes = portiesStore.useHook();
  const [eigen, setEigen] = useState("");
  const [status, setStatus] = useState("");
  const [vervaag, setVervaag] = useState(false);

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const straks = computeToday(cycle, weekOver(7)).phase;
  const set = volgendeSet(straks, uitgesloten, vast, opgeslagen);
  const fase = straks;
  const naam = getRecipe(getPhase(fase).recipes[0])?.name ?? getPhase(fase).label;
  const label = `${weekId(weekOver(7))}:${fase}`;

  const zet = (index: number, wijzig: (i: LijstItem) => LijstItem | null) => {
    lijstStore.bewaar(lijst.flatMap((i, n) => (n === index ? (wijzig(i) ? [wijzig(i) as LijstItem] : []) : [i])));
  };
  const groepen: { titel: string; filter: (i: LijstItem) => boolean }[] = [
    { titel: "Fruit", filter: (i) => !!i.ing && ING[i.ing].soort === "fruit" },
    { titel: "Groente", filter: (i) => !!i.ing && ING[i.ing].soort === "groente" },
    { titel: "Overig", filter: (i) => !!i.ing && (ING[i.ing].soort === "kruid" || ING[i.ing].soort === "zaad") },
    { titel: "Eigen items", filter: (i) => !i.ing },
  ];
  const open = lijst.filter((i) => !i.klaar).length;

  return (
    <main className="app-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>Boodschappen</h1>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{lijst.length ? `${lijst.length - open} van ${lijst.length}` : ""}</span>
      </div>

      <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Voor hoeveel sapjes doe je boodschappen?</span>
        <div className="segmented" role="group" aria-label="Aantal sapjes">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" aria-pressed={sapjes === n} onClick={() => portiesStore.bewaar(n)}>
              {n === 1 ? "1 sapje" : `${n} sapjes`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          {sapjes === 1
            ? "Je ziet de hoeveelheden voor één sapje. Bij veel fruit koop je meer dan je nodig hebt, daarom staat er ook wat je overhoudt."
            : `Je ziet wat je nodig hebt voor ${sapjes} sapjes van dezelfde combinatie, en wat je daarvoor koopt.`}
        </span>
      </div>

      {lijst.length === 0 ? (
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>
          Je lijstje is nog leeg. Tik op de startpagina bij je sapje op &ldquo;Zet op lijstje&rdquo;, of voeg hieronder zelf iets toe.
        </p>
      ) : (
        <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column" }}>
          {groepen.map((g) => {
            const items = lijst.map((i, n) => ({ i, n })).filter((x) => g.filter(x.i));
            if (!items.length) return null;
            return (
              <div key={g.titel} style={{ display: "flex", flexDirection: "column" }}>
                <span className="lj-groep">{g.titel}</span>
                {items.map(({ i, n }) => (
                  <button key={n} type="button" className="lj-li" aria-pressed={i.klaar} onClick={() => zet(n, (x) => ({ ...x, klaar: !x.klaar }))}>
                    <span className="lj-cb" aria-hidden="true">✓</span>
                    {i.ing ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/fruit/${i.ing}.svg`} alt="" />
                    ) : null}
                    <span className="lj-n">
                      {i.naam}
                      {i.ing ? (() => {
                        const ing = i.ing;
                        const delen = i.bron.length;
                        const totaalSapjes = sapjes * Math.max(1, delen);
                        const h = hoeveelheid(ing, totaalSapjes);
                        const hier = hoeveelheid(ing, sapjes).nodig;
                        const uitleg =
                          delen > 1
                            ? ` · ${i.bron.map((b) => `${hier} ${bronNaam(b)}`).join(" + ")}`
                            : sapjes > 1
                              ? ` · voor ${sapjes} sapjes`
                              : "";
                        return (
                          <>
                            <small>{h.nodig}{uitleg}</small>
                            {h.koop ? <small>Koop: {h.koop}{h.rest ? `. ${h.rest}` : ""}</small> : null}
                          </>
                        );
                      })() : <small>Eigen item</small>}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <form
        style={{ display: "flex", gap: 8 }}
        onSubmit={(e) => {
          e.preventDefault();
          const naam = eigen.trim();
          if (!naam) return;
          lijstStore.bewaar([...lijst, { naam: naam.slice(0, 60), bron: [], klaar: false }]);
          setEigen("");
        }}
      >
        <div className="field" style={{ flex: 1 }}>
          <input aria-label="Eigen item toevoegen" placeholder="Eigen item toevoegen" value={eigen} onChange={(e) => setEigen(e.target.value)} maxLength={60} />
        </div>
        <button type="submit" className="btn btn-light" style={{ minHeight: 48, borderRadius: 14, padding: "0 18px" }} aria-label="Toevoegen">+</button>
      </form>
      {lijst.some((i) => i.klaar) ? (
        <button type="button" className="btn btn-light btn-block" style={{ minHeight: 48, borderRadius: 16 }} onClick={() => lijstStore.bewaar(lijst.filter((i) => !i.klaar))}>
          Haal afgevinkte weg
        </button>
      ) : null}
      <section aria-labelledby="plan-t" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2 id="plan-t" className="display" style={{ fontSize: 24, lineHeight: 1.1 }}>Alvast vooruit plannen?</h2>
          <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
            Doe je je boodschappen voor meer dan één week, bijvoorbeeld in het weekend? Dan zie je hier welk sapje waarschijnlijk bij volgende week hoort. Zo haal je alles in één keer.
          </span>
        </div>
        {set.length ? (
          <div className="card" style={{ background: getPhase(fase).tint, borderRadius: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="display" style={{ fontSize: 24, color: getPhase(fase).dark }}>{naam}, verwacht</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>volgende week</span>
            </div>
            <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
              Volgens je cyclus zit je volgende week waarschijnlijk in je {getPhase(fase).label.toLowerCase()} ({naam}). Dat kan een paar dagen verschuiven.
            </span>
            <div style={{ opacity: vervaag ? 0 : 1, transition: "opacity .18s" }}>
              <Rij set={set} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              <button
                type="button"
                className="btn btn-dark"
                style={{ minHeight: 48, borderRadius: 16 }}
                onClick={() => setStatus(zetOpLijst(set, label) ? "Erbij gezet voor volgende week." : "Dit sapje staat al op je lijstje.")}
              >
                Zet dit ook op mijn lijstje
              </button>
              <button
                type="button"
                className="btn btn-light"
                style={{ minHeight: 48, borderRadius: 16 }}
                onClick={() => {
                  setVervaag(true);
                  setTimeout(() => {
                    schudVolgende(straks, set, uitgesloten, vast);
                    setVervaag(false);
                    setStatus("Nieuw sapje voor volgende week. Het blijft staan tot de week begint.");
                  }, 180);
                }}
              >
                Ander sapje (schud)
              </button>
            </div>
            <span role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 18 }}>{status}</span>
          </div>
        ) : (
          <p style={{ fontSize: 14, lineHeight: 1.5 }}>Met jouw allergieën en voorkeuren heeft Juna voor volgende week geen sapje. Pas je voorkeuren aan.</p>
        )}
      </section>

        <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column", gap: 6 }}>
          <strong style={{ fontSize: 15 }}>Hoe lang blijft je sap goed?</strong>
          <span style={{ fontSize: 13, lineHeight: 1.45 }}>{BEWAAR[bewaarMachine()]}</span>
          <span style={{ fontSize: 13, lineHeight: 1.45 }}>
            Giet het in schone, afgesloten flessen, zo vol mogelijk, en zet ze achterin de koelkast. Een schijfje citroen of limoen helpt. Schud even voor het drinken.
          </span>
          <span style={{ fontSize: 13, lineHeight: 1.45 }}>Meer sap dan je opkrijgt? Vries het in porties in.</span>
          <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>
            Vers sap is niet gepasteuriseerd. Houd je daarom aan de bewaartijd en zet het meteen koud weg.
          </span>
        </div>
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--ink-2)" }}>
        Juna houdt rekening met je allergieën en voorkeuren. Zet je meerdere weken op je lijstje, dan telt Juna dezelfde ingrediënten bij elkaar op. Je lijstje blijft alleen op dit toestel.
      </span>
    </main>
  );
}

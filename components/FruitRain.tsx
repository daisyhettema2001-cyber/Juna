"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import type { Phase, PhaseId } from "@/lib/data";

import { HOUDBAAR } from "@/lib/porties";
import PimpSap from "@/components/PimpSap";
import { advies, type Machine } from "@/lib/advies";
import { PHASES } from "@/lib/data";
import { bewaardStore, isBewaard, maakGemaaktOngedaan, markeerGemaakt, vastStore, wisselBewaard, zetOpLijst } from "@/lib/mijn";
import { ING, fasesMet, metPeper, schudSet, weekId, weekSet, type Ingredient } from "@/lib/ingredients";

const OFFSET = 90; // de lege ruimte boven de stapel halen we weg
const W = 390; // breedte van het ontwerp in px; alles hieronder schaalt mee via cqw
const cq = (px: number) => `${((px / W) * 100).toFixed(3)}cqw`;
const frac = (x: number) => x - Math.floor(x);

type Piece = { left: number; top: number; size: number; rot: number; delay: number; dur: number; src: string; ing: string };

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) || 0);
const kleurAfstand = (a: string, b: string) => {
  const x = rgb(a), y = rgb(b);
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};

// Verdeelt het fruit zo dat gelijke kleuren niet naast of op elkaar komen te liggen.
function verdeel(stack: Ingredient[], rowCounts: number[]): string[][] {
  const gebruik: Record<string, number> = {};
  stack.forEach((i) => (gebruik[i.id] = 0));
  const rijen: Ingredient[][] = [];
  rowCounts.forEach((count, r) => {
    const rij: Ingredient[] = [];
    for (let j = 0; j < count; j++) {
      const buren: Ingredient[] = [];
      if (j > 0) buren.push(rij[j - 1]);
      if (r > 0) buren.push(rijen[r - 1][j], rijen[r - 1][j + 1]);
      const min = Math.min(...stack.map((i) => gebruik[i.id]));
      const kandidaten = stack.filter((i) => gebruik[i.id] <= min + 1);
      let beste = kandidaten[0];
      let besteScore = -1;
      kandidaten.forEach((i, n) => {
        const score = buren.length ? Math.min(...buren.map((b) => (b.id === i.id ? 0 : kleurAfstand(b.kleur, i.kleur)))) : 100;
        if (score > besteScore + 0.001 || (Math.abs(score - besteScore) < 0.001 && gebruik[i.id] < gebruik[beste.id] && n >= 0)) {
          beste = i;
          besteScore = score;
        }
      });
      gebruik[beste.id]++;
      rij.push(beste);
    }
    rijen.push(rij);
  });
  return rijen.map((r) => r.map((i) => i.id));
}

function build(ings: Ingredient[]) {
  const stack = ings.filter((i) => !i.klein);
  const smalls = ings.filter((i) => i.klein);
  const rowCounts = [5, 4, 3];
  const rowSizes = [66, 64, 62];
  const items: Piece[] = [];
  const shadows: { left: number; w: number; delay: number }[] = [];
  let s = 0;
  const gelegd: Record<string, number> = {};
  const lay = verdeel(stack, rowCounts);
  for (let r = 0; r < rowCounts.length; r++) {
    const count = rowCounts[r];
    const size = rowSizes[r];
    const top = Math.round(440 - size * 0.92 - r * 46);
    for (let j = 0; j < count; j++) {
      const ing = stack.find((x) => x.id === lay[r][j])!;
      const left = Math.round(195 + (j - (count - 1) / 2) * 56 - size / 2);
      const delay = 0.1 + r * 0.5 + j * 0.12 + frac(s * 0.31) * 0.08;
      const n = (gelegd[ing.id] = (gelegd[ing.id] ?? 0) + 1);
      const file = ing.snede && n % 2 === 0 ? ing.snede : ing.id;
      const banaan = ing.id === "banana"; // een banaan ligt op zijn bolle kant
      items.push({ left, top: banaan ? top + Math.round(size * 0.2) : top, size, rot: banaan ? 135 + (((s * 37) % 13) - 6) / 2 : ((s * 37) % 13) - 6, delay, dur: 1.5, src: `/fruit/${file}.svg`, ing: ing.id });
      if (r === 0) shadows.push({ left: left + 4, w: size - 8, delay });
      s++;
    }
  }
  const round = stack.filter((i) => i.rond);
  const kL = round[0] ?? stack[0];
  const kR = round[1] ?? round[0] ?? stack[0];
  const mk = (id: string, left: number, size: number, delay: number, dur: number): Piece => ({
    left, top: Math.round(440 - size * 0.92), size, rot: 0, delay, dur, src: `/fruit/${id}.svg`, ing: id,
  });
  const left = [mk(kL.id, 6, 44, 1.0, 2.6)];
  const right = [mk(kR.id, 340, 44, 1.25, 2.6)];
  if (smalls.length) {
    // Korreltjes, pitjes en zaadjes blijven liggen: een paar vooraan en aan de zijkanten.
    const plekken = [128, 252, 20, 356, 158, 226, 34, 342, 100, 280];
    smalls.forEach((sm, k) => {
      plekken.filter((_, n) => n % smalls.length === k).slice(0, 5).forEach((x, n) => {
        items.push({ left: x, top: Math.round(440 - 16 * 0.92) - (n % 2) * 3, size: 16, rot: (n * 53) % 360, delay: 1.7 + n * 0.12 + k * 0.05, dur: 1.5, src: `/fruit/${sm.id}.svg`, ing: sm.id });
      });
    });
  }
  return { items, shadows, left, right };
}

const KEY = "juna.fruit.week";
const SET_KEY = "juna.fruit.set.v1";
const MACHINE_KEY = "juna.machine.v1";

function loadMachine(): Machine {
  try {
    const m = localStorage.getItem(MACHINE_KEY);
    if (m === "mixer" || m === "slowjuicer" || m === "beide") return m;
  } catch {
    /* ignore */
  }
  return "beide";
}

type Saved = { week: string; phase: PhaseId; sets: string[][] };

function reduced() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// Nieuw fruit vliegt naar het icoontje van het fruitboek.
function vliegNaarBoek(ids: string[], vanKnop: HTMLElement | null) {
  try {
    if (reduced() || !ids.length) return;
    const doel = document.querySelector<HTMLElement>('[data-tab="fruitboek"]');
    if (!doel) return;
    const d = doel.getBoundingClientRect();
    const dx = d.left + d.width / 2;
    const dy = d.top + d.height / 2 - 8;
    const knop = vanKnop?.getBoundingClientRect();
    let n = 0;
    ids.forEach((id) => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(`.fruit-stage [data-ing="${id}"]`)).filter((e) => !e.classList.contains("fr-roll-l") && !e.classList.contains("fr-roll-r"));
      const el = els[0];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const zichtbaar = r.bottom > 0 && r.top < window.innerHeight;
      const sx = zichtbaar ? r.left + r.width / 2 : knop ? knop.left + knop.width / 2 : window.innerWidth / 2;
      const sy = zichtbaar ? r.top + r.height / 2 : knop ? knop.top : window.innerHeight / 2;
      const size = zichtbaar ? Math.max(40, r.width) : 56;
      const img = document.createElement("img");
      img.src = `/fruit/${id}.svg`;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.style.cssText = `position:fixed;z-index:60;left:${sx - size / 2}px;top:${sy - size / 2}px;width:${size}px;height:${size}px;pointer-events:none;will-change:transform`;
      document.body.appendChild(img);
      const delay = n * 160;
      n++;
      const a = img.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
          { transform: `translate(${(dx - sx) * 0.25}px,${(dy - sy) * 0.25 - 50}px) scale(1.15)`, opacity: 1, offset: 0.3 },
          { transform: `translate(${dx - sx}px,${dy - sy}px) scale(0.28)`, opacity: 0.25, offset: 1 },
        ],
        { duration: 850, delay, easing: "cubic-bezier(.5,0,.7,.4)", fill: "both" },
      );
      a.onfinish = () => {
        img.remove();
        doel.animate([{ transform: "scale(1)" }, { transform: "scale(1.3) rotate(-8deg)" }, { transform: "scale(1)" }], { duration: 350 });
      };
    });
  } catch {
    /* animatie is extra */
  }
}

function shouldPlay(phase: PhaseId): boolean {
  try {
    if (reduced()) return false;
    return localStorage.getItem(KEY) !== `${weekId()}:${phase}`;
  } catch {
    return true;
  }
}

function loadSets(phase: PhaseId, uitgesloten: string[], vast: string | null): string[][] {
  try {
    const raw = localStorage.getItem(SET_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Saved;
      const geldig = Array.isArray(v.sets) && v.sets.length > 0 && v.sets.every((st) => Array.isArray(st) && st.length >= 4 && st.length <= 5 && st.every((id) => ING[id] && !uitgesloten.includes(id)));
      if (v.week === weekId() && v.phase === phase && geldig) return v.sets.map((st) => metPeper(st, uitgesloten));
    }
  } catch {
    /* ignore */
  }
  const nieuw = weekSet(phase, uitgesloten, vast);
  return nieuw.length ? [nieuw] : [];
}

export default function FruitRain({ phase, uitgesloten = [] }: { phase: Phase & { recipeName: string }; uitgesloten?: string[] }) {
  // Deze component wordt pas getoond nadat de pagina in de browser geladen is.
  const phaseId = phase.id;
  const [animate, setAnimate] = useState<boolean>(() => shouldPlay(phaseId));
  const [run, setRun] = useState(0);
  const [sets, setSets] = useState<string[][]>(() => loadSets(phaseId, uitgesloten, vastStore.laad()));
  const vast = vastStore.useHook();
  const bewaardLijst = bewaardStore.useHook();
  const [status, setStatus] = useState("");
  const [gedaan, setGedaan] = useState(false);
  const [gemaaktMsg, setGemaaktMsg] = useState("");
  const [terug, setTerug] = useState<{ set: string[]; ids: string[] } | null>(null);
  const [machine, setMachine] = useState<Machine>(() => loadMachine());
  const [gesloten, setGesloten] = useState<string>("");
  const current = sets[sets.length - 1] ?? [];
  const adv = advies(current, machine, uitgesloten);
  const setKey = `${machine}:${current.join(",")}`;
  const kiesMachine = (m: Machine) => {
    setMachine(m);
    try {
      localStorage.setItem(MACHINE_KEY, m);
    } catch {
      /* opslag niet beschikbaar */
    }
  };
  const ings = current.map((id) => ING[id]);
  const { items, shadows, left, right } = current.length ? build(ings) : { items: [], shadows: [], left: [], right: [] };

  useEffect(() => {
    try {
      localStorage.setItem(KEY, `${weekId()}:${phaseId}`);
      localStorage.setItem(SET_KEY, JSON.stringify({ week: weekId(), phase: phaseId, sets: sets.slice(-6) } satisfies Saved));
    } catch {
      /* opslag niet beschikbaar */
    }
  }, [phaseId, sets]);

  // Andere set of fase: de "Ongedaan maken"-knop hoort niet meer bij het getoonde sapje.
  useEffect(() => {
    setTerug(null);
    setGedaan(false);
    setGemaaktMsg("");
  }, [phaseId, current.join(",")]);

  // Eerst de oude stapel weghalen (leeg vak), dan pas de nieuwe laten vallen.
  const [leeg, setLeeg] = useState(false);

  const opnieuw = (nieuweSet?: () => void) => {
    if (reduced()) {
      nieuweSet?.();
      setAnimate(false);
      setRun((n) => n + 1);
      return;
    }
    setLeeg(true);
    setTimeout(() => {
      nieuweSet?.();
      setRun((n) => n + 1);
      setAnimate(true);
      setLeeg(false);
    }, 150);
  };

  const replay = () => opnieuw();
  const shuffle = () => opnieuw(() => setSets((prev) => {
    const nieuw = schudSet(phaseId, prev, uitgesloten, vast);
    return nieuw.length ? [...prev, nieuw] : prev;
  }));

  const box = (p: Piece) => ({
    left: cq(p.left),
    top: cq(p.top - OFFSET),
    width: cq(p.size),
    height: cq(p.size),
  });

  if (!current.length) {
    return (
      <div className="fr-info" style={{ padding: 8 }}>
        <span className="display" style={{ fontSize: 24, color: phase.dark }}>{phase.recipeName}</span>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
          Met jouw allergieën en voorkeuren heeft Juna voor deze fase geen sapje meer. Pas je lijst aan, dan zoekt Juna opnieuw.
        </p>
        <Link href="/app/voorkeuren" style={{ color: phase.dark, fontWeight: 700, fontSize: 14 }}>Voorkeuren aanpassen</Link>
      </div>
    );
  }

  return (
    <>
      <div className="fruit-stage" onClick={replay} role="img" aria-label={`Fruit van deze week: ${ings.map((i) => i.naam).join(", ")}. Tik om opnieuw af te spelen`} key={run}>
        {leeg ? null : (
          <>
            <span className={animate ? "fr-glow fr-anim" : "fr-glow"} style={{ left: cq(25), top: cq(235 - OFFSET), width: cq(340), height: cq(260), background: `radial-gradient(closest-side, ${phase.color}38, ${phase.color}00)` }} />
            <span className="fr-ground" style={{ left: cq(45), top: cq(430 - OFFSET), width: cq(300), height: cq(18) }} />
          </>
        )}
        {leeg || !animate ? null : [[-46, -34], [0, -52], [46, -34], [-62, 4], [62, 4], [-24, -50], [24, -50]].map(([dx, dy], i) => (
          <span key={`k${i}`} className="fr-spark" style={{ left: cq(195 - 4), top: cq(300 - OFFSET), width: cq(8), height: cq(8), background: i % 2 ? "#fff" : phase.color, ["--dx" as string]: cq(dx), ["--dy" as string]: cq(dy), animationDelay: `${(2.05 + (i % 3) * 0.05).toFixed(2)}s` }} />
        ))}
        {leeg ? null : shadows.map((sh, i) => (
          <span
            key={`s${i}`}
            className={animate ? "fr-shade fr-anim" : "fr-shade"}
            style={{ left: cq(sh.left), top: cq(436 - OFFSET), width: cq(sh.w), height: cq(8), animationDelay: `${sh.delay.toFixed(2)}s` }}
          />
        ))}
        {leeg ? null : items.map((p, i) => (
          <span key={i} data-ing={p.ing} className={animate ? "fr-fruit fr-anim" : "fr-fruit"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} style={{ transform: `rotate(${p.rot}deg)` }} />
          </span>
        ))}
        {leeg ? null : left.map((p, i) => (
          <span key={`l${i}`} data-ing={p.ing} className={animate ? "fr-roll-l fr-anim" : "fr-gone"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s`, animationDuration: `${p.dur}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} />
          </span>
        ))}
        {leeg ? null : right.map((p, i) => (
          <span key={`r${i}`} data-ing={p.ing} className={animate ? "fr-roll-r fr-anim" : "fr-gone"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s`, animationDuration: `${p.dur}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} />
          </span>
        ))}
      </div>

      <div className="fr-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span className="display" style={{ fontSize: 32, color: phase.dark }}>{phase.recipeName}</span>
          <button type="button" onClick={shuffle} className="fr-shuffle" style={{ background: phase.dark }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Schud opnieuw
          </button>
        </div>
        <ul className="fr-list">
          {ings.map((i) => (
            <li key={i.id}>
              <span className="dot" style={{ width: 22, height: 22, flex: "none", background: i.kleur, marginTop: 1 }} />
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <strong>{i.naam}</strong>
                <span style={{ fontSize: 13, lineHeight: 1.4 }}>{i.reden}</span>
                {i.waarschuwing ? <span style={{ fontSize: 12, lineHeight: 1.35, color: phase.dark, fontStyle: "italic" }}>{i.waarschuwing}</span> : null}
              </span>
              <button
                type="button"
                className="fr-slot"
                aria-pressed={vast === i.id}
                aria-label={vast === i.id ? `Maak ${i.naam} los` : `Zet ${i.naam} vast`}
                onClick={() => {
                  vastStore.bewaar(vast === i.id ? null : i.id);
                  setStatus(vast === i.id ? `${i.naam} is los. Bij schudden kan alles wisselen.` : `${i.naam} blijft staan als je schudt.`);
                }}
                style={vast === i.id ? { background: phase.dark, color: "#fff" } : undefined}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d={vast === i.id ? "M8 11V8a4 4 0 0 1 8 0v3" : "M8 11V8a4 4 0 0 1 7.5-2"} />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        {vast && !fasesMet(vast).includes(phaseId) ? (
          <p className="fr-tip">
            {ING[vast].naam} staat vast, maar past niet in deze fase. Hij komt terug in{" "}
            {fasesMet(vast).map((f) => PHASES.find((p) => p.id === f)?.label.toLowerCase()).join(" en ")}.
          </p>
        ) : null}
        <div className="fr-acties">
          <button
            type="button"
            className="fr-gemaakt"
            style={{ background: phase.dark, opacity: gedaan ? 0.5 : 1, transition: "opacity .25s" }}
            onClick={(e) => {
              const r = markeerGemaakt(current);
              vliegNaarBoek(r.nieuweIds, e.currentTarget);
              setGedaan(true);
              if (r.alVandaag) {
                setGemaaktMsg("Staat al in je fruitboek.");
                return;
              }
              setTerug({ set: [...current], ids: r.nieuweIds });
              setGemaaktMsg("Toegevoegd aan fruitboek.");
            }}
          >
            Gemaakt ✓
          </button>
          {gemaaktMsg ? (
            <div role="status" aria-live="polite" className="fr-gemaaktmsg">
              <span>{gemaaktMsg}</span>
              {terug ? (
                <button
                  type="button"
                  className="fr-undo"
                  onClick={() => {
                    maakGemaaktOngedaan(terug.set, terug.ids);
                    setTerug(null);
                    setGedaan(false);
                    setGemaaktMsg("Teruggedraaid.");
                  }}
                >
                  Ongedaan maken
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="fr-acties2">
            <button type="button" onClick={() => setStatus(`${zetOpLijst(current, `${weekId()}:${phaseId}`) ? "Op je boodschappenlijstje gezet." : "Stond al op je lijstje."}`)}>
              Zet op lijstje
            </button>
            <button
              type="button"
              aria-pressed={isBewaard(bewaardLijst, current)}
              onClick={() => {
                const was = isBewaard(bewaardLijst, current);
                wisselBewaard(phaseId, current);
                setStatus(was ? "Niet meer bewaard." : "Bewaard.");
              }}
            >
              {isBewaard(bewaardLijst, current) ? "♥ Bewaard" : "♡ Bewaar"}
            </button>
          </div>
          <span role="status" aria-live="polite" className="fr-status">{status}</span>
        </div>
        <PimpSap set={current} uitgesloten={uitgesloten} machine={machine} kleur={phase.dark} />
        <p className="fr-tip">{adv.tip}</p>
        <div className="fr-machine" role="group" aria-label="Welk apparaat heb je?">
          <span>Ik heb:</span>
          {([["beide", "Beide"], ["mixer", "Blender"], ["slowjuicer", "Slow juicer"]] as const).map(([m, t]) => (
            <button key={m} type="button" aria-pressed={machine === m} onClick={() => kiesMachine(m)} style={machine === m ? { background: phase.dark, color: "#fff" } : undefined}>
              {t}
            </button>
          ))}
        </div>
        <p className="fr-tip"><strong>Houdbaarheid:</strong> {HOUDBAAR[machine]}</p>
        <span style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>Juna geeft geen medisch advies. Heb je klachten of gebruik je medicijnen? Overleg met je huisarts.</span>
      </div>
      {adv.popup && gesloten !== setKey ? (
        <div className="fr-popup-bg" role="dialog" aria-modal="true" aria-label={adv.popup.titel} onClick={() => setGesloten(setKey)}>
          <div className="fr-popup" onClick={(e) => e.stopPropagation()}>
            <strong>{adv.popup.titel}</strong>
            <p>{adv.popup.tekst}</p>
            <button type="button" onClick={() => setGesloten(setKey)} style={{ background: phase.dark }}>Begrepen</button>
          </div>
        </div>
      ) : null}
    </>
  );
}

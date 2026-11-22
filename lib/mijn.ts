"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PhaseId } from "./data";
import { ING, metPeper, schudSet, weekId, weekSet } from "./ingredients";

/* Alles hier blijft op het apparaat van de gebruiker (localStorage). */

function maak<T>(key: string, leeg: T, schoon: (v: unknown) => T) {
  const evt = `juna-store-${key}`;
  const lees = (): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const subscribe = (cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener(evt, cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener(evt, cb);
    };
  };
  const parse = (raw: string | null): T => {
    try {
      return raw ? schoon(JSON.parse(raw)) : leeg;
    } catch {
      return leeg;
    }
  };
  return {
    laad: () => parse(lees()),
    bewaar: (v: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(v));
        window.dispatchEvent(new Event(evt));
      } catch {
        /* opslag niet beschikbaar */
      }
    },
    wis: () => {
      try {
        localStorage.removeItem(key);
        window.dispatchEvent(new Event(evt));
      } catch {
        /* ignore */
      }
    },
    useHook: (): T => {
      const raw = useSyncExternalStore<string | null>(subscribe, lees, () => null);
      return useMemo(() => parse(raw), [raw]);
    },
  };
}

const ids = (v: unknown): string[] => (Array.isArray(v) ? Array.from(new Set(v.filter((x): x is string => typeof x === "string" && !!ING[x]))) : []);

/* ---- gekozen extra (huid of haar) ---- */
export const extraStore = maak<"huid" | "haar" | null>("juna.extra.v1", null, (v) => (v === "huid" || v === "haar" ? v : null));

/* ---- hoe Juna je noemt (optioneel, blijft alleen op dit toestel) ---- */
export const naamStore = maak<string>("juna.naam.v1", "", (v) => (typeof v === "string" ? v.trim().slice(0, 30) : ""));

/* ---- voor hoeveel sapjes ga je boodschappen doen (1 tot 3) ---- */
export const portiesStore = maak<number>("juna.porties.v1", 1, (v) => (v === 2 || v === 3 ? v : 1));

/* ---- vastgezet ingrediënt (maximaal één) ---- */
const LEEG_VAST: string | null = null;
export const vastStore = maak<string | null>("juna.vast.v1", LEEG_VAST, (v) => (typeof v === "string" && ING[v] ? v : null));

/* ---- fruitboek ---- */
const LEEG_BOEK: string[] = [];
export const boekStore = maak<string[]>("juna.boek.v1", LEEG_BOEK, ids);

/* ---- bewaarde sapjes ---- */
export type Bewaard = { phase: PhaseId; ids: string[]; datum: string };
const LEEG_BEWAARD: Bewaard[] = [];
export const bewaardStore = maak<Bewaard[]>("juna.bewaard.v1", LEEG_BEWAARD, (v) =>
  Array.isArray(v)
    ? (v as Bewaard[])
        .filter((b) => b && typeof b.datum === "string" && typeof b.phase === "string" && Array.isArray(b.ids) && b.ids.length === 4 && b.ids.every((x) => ING[x]))
        .slice(-50)
    : [],
);
const sleutel = (a: string[]) => [...a].sort().join(",");
export const isBewaard = (lijst: Bewaard[], set: string[]) => lijst.some((b) => sleutel(b.ids) === sleutel(set));
export function wisselBewaard(phase: PhaseId, set: string[]) {
  const lijst = bewaardStore.laad();
  if (isBewaard(lijst, set)) bewaardStore.bewaar(lijst.filter((b) => sleutel(b.ids) !== sleutel(set)));
  else bewaardStore.bewaar([...lijst, { phase, ids: set, datum: dagISO() }]);
}

export function dagISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---- "Gemaakt": alleen dan komt fruit in het fruitboek ---- */
const GEMAAKT_KEY = "juna.gemaakt.v1";
type Gemaakt = { dag: string; sets: string[]; nieuw?: Record<string, string[]> };
function leesGemaakt(): Gemaakt {
  try {
    const raw = JSON.parse(localStorage.getItem(GEMAAKT_KEY) ?? "null") as Gemaakt | null;
    if (raw && raw.dag === dagISO() && Array.isArray(raw.sets)) return { dag: raw.dag, sets: raw.sets, nieuw: raw.nieuw ?? {} };
  } catch {
    /* ignore */
  }
  return { dag: dagISO(), sets: [], nieuw: {} };
}
function schrijfGemaakt(g: Gemaakt) {
  try {
    localStorage.setItem(GEMAAKT_KEY, JSON.stringify(g));
  } catch {
    /* ignore */
  }
}

/** Is dit sapje vandaag al als gemaakt afgevinkt? */
export function isVandaagGemaakt(set: string[]): boolean {
  return leesGemaakt().sets.includes(sleutel(set));
}

/** `nieuweIds` is het fruit dat nu voor het eerst in het fruitboek komt (voor de animatie); `terugIds` is wat "Ongedaan maken" weghaalt. */
export function markeerGemaakt(set: string[]): { nieuw: number; nieuweIds: string[]; terugIds: string[]; alVandaag: boolean } {
  const g = leesGemaakt();
  const k = sleutel(set);
  if (g.sets.includes(k)) return { nieuw: 0, nieuweIds: [], terugIds: g.nieuw?.[k] ?? [], alVandaag: true };
  const boek = boekStore.laad();
  const nieuw = set.filter((id) => !boek.includes(id));
  schrijfGemaakt({ dag: g.dag, sets: [...g.sets, k], nieuw: { ...g.nieuw, [k]: nieuw } });
  if (nieuw.length) boekStore.bewaar([...boek, ...nieuw]);
  return { nieuw: nieuw.length, nieuweIds: nieuw, terugIds: nieuw, alVandaag: false };
}

/* Haalt "gemaakt" van vandaag weer weg en zet het nieuwe fruit terug uit het fruitboek. */
export function maakGemaaktOngedaan(set: string[], nieuweIds: string[]): void {
  const g = leesGemaakt();
  const k = sleutel(set);
  const rest = { ...g.nieuw };
  delete rest[k];
  schrijfGemaakt({ dag: g.dag, sets: g.sets.filter((x) => x !== k), nieuw: rest });
  if (nieuweIds.length) boekStore.bewaar(boekStore.laad().filter((id) => !nieuweIds.includes(id)));
}

/* ---- boodschappenlijstje ---- */
export type LijstItem = { ing?: string; naam: string; bron: string[]; klaar: boolean };
const LEEG_LIJST: LijstItem[] = [];
export const lijstStore = maak<LijstItem[]>("juna.lijst.v1", LEEG_LIJST, (v) =>
  Array.isArray(v)
    ? (v as LijstItem[])
        .filter((i) => i && typeof i.naam === "string" && Array.isArray(i.bron))
        .map((i) => ({ ing: i.ing && ING[i.ing] ? i.ing : undefined, naam: i.naam.slice(0, 60), bron: i.bron.filter((b) => typeof b === "string"), klaar: !!i.klaar }))
        .slice(0, 200)
    : [],
);

/** Zet de ingrediënten van een sapje op het lijstje. Dezelfde ingrediënten uit een andere week tellen mee als "× 2". */
export function zetOpLijst(set: string[], bronLabel: string): number {
  const lijst = lijstStore.laad().map((i) => ({ ...i }));
  let nieuw = 0;
  for (const id of set) {
    const bestaand = lijst.find((i) => i.ing === id);
    if (bestaand) {
      if (!bestaand.bron.includes(bronLabel)) {
        bestaand.bron.push(bronLabel);
        bestaand.klaar = false;
        nieuw++;
      }
    } else {
      lijst.push({ ing: id, naam: ING[id].naam, bron: [bronLabel], klaar: false });
      nieuw++;
    }
  }
  lijstStore.bewaar(lijst);
  return nieuw;
}

/* ---- gekozen set voor volgende week ---- */
export type VolgendeWeek = { week: string; phase: PhaseId; ids: string[] };
export const volgendeStore = maak<VolgendeWeek | null>("juna.volgende.v1", null, (v) => {
  const x = v as VolgendeWeek | null;
  return x && typeof x.week === "string" && typeof x.phase === "string" && Array.isArray(x.ids) && x.ids.length === 4 && x.ids.every((i) => ING[i]) ? x : null;
});

export function weekOver(dagen: number) {
  const d = new Date();
  d.setDate(d.getDate() + dagen);
  return d;
}

/** De set voor volgende week: een zelf gekozen set als die er is, anders de vaste keuze van Juna. */
export function volgendeSet(phase: PhaseId, uitgesloten: string[], vast: string | null, opgeslagen: VolgendeWeek | null): string[] {
  const d = weekOver(7);
  if (opgeslagen && opgeslagen.week === weekId(d) && opgeslagen.phase === phase && !opgeslagen.ids.some((i) => uitgesloten.includes(i))) return metPeper(opgeslagen.ids, uitgesloten);
  return weekSet(phase, uitgesloten, vast, d);
}

export function schudVolgende(phase: PhaseId, huidig: string[], uitgesloten: string[], vast: string | null) {
  const nieuw = schudSet(phase, [huidig], uitgesloten, vast);
  if (nieuw.length) volgendeStore.bewaar({ week: weekId(weekOver(7)), phase, ids: nieuw });
}

/* ---- de set van deze week, zoals Vandaag die toont ---- */
export function dezeSet(phase: PhaseId, uitgesloten: string[], vast: string | null): string[] {
  try {
    const raw = localStorage.getItem("juna.fruit.set.v1");
    if (raw) {
      const v = JSON.parse(raw) as { week: string; phase: PhaseId; sets: string[][] };
      const laatste = Array.isArray(v.sets) ? v.sets[v.sets.length - 1] : null;
      if (v.week === weekId() && v.phase === phase && laatste && laatste.length >= 4 && laatste.length <= 5 && laatste.every((i) => ING[i] && !uitgesloten.includes(i))) return metPeper(laatste, uitgesloten);
    }
  } catch {
    /* ignore */
  }
  return weekSet(phase, uitgesloten, vast);
}

export function wisAlleMijn() {
  vastStore.wis();
  boekStore.wis();
  bewaardStore.wis();
  lijstStore.wis();
  volgendeStore.wis();
  extraStore.wis();
  portiesStore.wis();
  naamStore.wis();
  try {
    localStorage.removeItem(GEMAAKT_KEY);
    localStorage.removeItem("juna.fruit.set.v1");
    localStorage.removeItem("juna.fruit.week");
  } catch {
    /* ignore */
  }
}

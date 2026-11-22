"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ING } from "./ingredients";
import type { Recipe } from "./data";

export type Voorkeuren = { allergie: string[]; nietLekker: string[] };

/* Alles wat Juna ooit kan aanraden: de ingrediënten plus de vloeistoffen uit de tips. */
export type Item = { id: string; naam: string; soort: string; zoek: string[] };

const EXTRA: Item[] = [
  { id: "kokos", naam: "Kokos", soort: "vloeistof", zoek: ["kokosmelk", "kokoswater", "kokosnoot"] },
  { id: "melk", naam: "Melk", soort: "vloeistof", zoek: ["koemelk", "zuivel", "lactose"] },
  { id: "haver", naam: "Haver", soort: "vloeistof", zoek: ["haverdrink", "havermelk", "haverdrank"] },
];

const ZOEK: Record<string, string[]> = {
  orange: ["appelsien", "sinas"],
  almond: ["amandelmelk", "noot", "noten"],
  pumpkinseed: ["pompoen", "zaden", "pitten"],
  strawberry: ["aardbeien"],
  raspberry: ["frambozen"],
  blueberry: ["blauwe bessen", "bosbes", "bessen"],
  cherry: ["kersen"],
  grape: ["druiven", "druif"],
  celery: ["bleekselderij", "selderie"],
  beet: ["bieten", "rode bieten", "rode biet"],
  carrot: ["peen", "wortelen"],
  redpepper: ["paprika"],
  pepper: ["peper"],
  cacao: ["cacao", "chocolade", "cacoa"],
  mint: ["munt", "pepermunt"],
  kale: ["boerenkool", "kool"],
  spinach: ["spinazie", "bladgroen"],
  banana: ["bananen"],
  date: ["dadels"],
  ginger: ["gember", "djahe"],
  turmeric: ["kurkuma", "geelwortel"],
  pomegranate: ["granaatappelpitjes"],
};

function normaal(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export const ITEMS: Item[] = [
  ...Object.values(ING).map((i) => ({ id: i.id, naam: i.naam, soort: i.soort, zoek: ZOEK[i.id] ?? [] })),
  ...EXTRA,
].sort((a, b) => a.naam.localeCompare(b.naam, "nl"));

export function itemNaam(id: string) {
  return ITEMS.find((i) => i.id === id)?.naam ?? id;
}

/** Snelkeuzes: kiest in één tik alles uit een familie. */
export const GROEPEN: { id: string; naam: string; ids: string[] }[] = [
  { id: "noten", naam: "Noten en zaden", ids: ["almond", "pumpkinseed"] },
  { id: "citrus", naam: "Citrus", ids: ["orange", "lemon", "lime", "grapefruit"] },
  { id: "bessen", naam: "Bessen", ids: ["blueberry", "strawberry", "raspberry", "cherry"] },
  { id: "tropisch", naam: "Tropisch fruit", ids: ["mango", "papaya", "pineapple", "banana"] },
  { id: "kokos", naam: "Kokos", ids: ["kokos"] },
  { id: "haver", naam: "Haver", ids: ["haver"] },
];

/** Zoekt na 2 letters in namen en alternatieve namen. */
export function zoek(invoer: string, uitgesloten: string[] = []): Item[] {
  const q = normaal(invoer);
  if (q.length < 2) return [];
  return ITEMS.filter((i) => !uitgesloten.includes(i.id))
    .map((i) => {
      const namen = [i.naam, ...i.zoek].map(normaal);
      const begin = namen.some((n) => n.startsWith(q) || n.split(" ").some((w) => w.startsWith(q)));
      const bevat = namen.some((n) => n.includes(q));
      return { i, score: begin ? 0 : bevat ? 1 : 2 };
    })
    .filter((x) => x.score < 2)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.i)
    .slice(0, 6);
}

/* ---------- opslag, alleen op dit apparaat ---------- */
const KEY = "juna.voorkeuren.v1";
const EVT = "juna-voorkeuren-change";
const LEEG: Voorkeuren = { allergie: [], nietLekker: [] };
const GELDIG = new Set(ITEMS.map((i) => i.id));

function schoon(v: Partial<Voorkeuren> | null | undefined): Voorkeuren {
  const f = (a: unknown) => (Array.isArray(a) ? Array.from(new Set(a.filter((x): x is string => typeof x === "string" && GELDIG.has(x)))) : []);
  return { allergie: f(v?.allergie), nietLekker: f(v?.nietLekker) };
}

export function loadVoorkeuren(): Voorkeuren {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? schoon(JSON.parse(raw)) : LEEG;
  } catch {
    return LEEG;
  }
}

export function saveVoorkeuren(v: Voorkeuren) {
  try {
    localStorage.setItem(KEY, JSON.stringify(schoon(v)));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* opslag niet beschikbaar */
  }
}

export function clearVoorkeuren() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Hook: de voorkeuren, plus de gecombineerde lijst met alles wat Juna moet weglaten. */
export function useVoorkeuren() {
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, () => null);
  return useMemo(() => {
    let v = LEEG;
    try {
      v = raw ? schoon(JSON.parse(raw)) : LEEG;
    } catch {
      v = LEEG;
    }
    return { ...v, uitgesloten: Array.from(new Set([...v.allergie, ...v.nietLekker])) };
  }, [raw]);
}

/** Staat er een uitgesloten ingrediënt in dit recept? */
export function receptOk(r: Recipe, uitgesloten: string[]): boolean {
  if (!uitgesloten.length) return true;
  const tekst = r.ingredients.map((i) => normaal(i.name)).join(" | ");
  return !uitgesloten.some((id) => {
    const it = ITEMS.find((x) => x.id === id);
    if (!it) return false;
    const woorden = [it.naam, ...it.zoek].map(normaal).filter((w) => w.length >= 4);
    return woorden.some((w) => tekst.includes(w));
  });
}

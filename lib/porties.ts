import { AMT } from "./ingredients";

/* Hoeveel heb je nodig voor meerdere sapjes, en wat koop je dan in de winkel?
   Alle hoeveelheden zijn een schatting en kunnen per vrucht en maat verschillen. */
type Heel = { enk: string; mv: string; per: number; rest?: string };
type P = { per: number; enk: string; mv: string; heel?: Heel };

const st = { enk: "stuk", mv: "stuks" };
const hd = { enk: "handje", mv: "handjes" };
const heel = (enk: string, mv: string, per: number, rest?: string): Heel => ({ enk, mv, per, rest });

const PORTIE: Record<string, P> = {
  beet: { per: 1, enk: "middelgrote biet", mv: "middelgrote bieten" },
  pomegranate: { per: 0.5, ...st, heel: heel("hele granaatappel", "hele granaatappels", 1, "De rest past in yoghurt of een salade.") },
  orange: { per: 2, ...st },
  ginger: { per: 2, enk: "cm", mv: "cm", heel: heel("stuk gember van ongeveer 8 cm", "stukken gember van ongeveer 8 cm", 8, "Gember kun je invriezen. Rasp er dan steeds wat af.") },
  spinach: { per: 1, ...hd, heel: heel("zak spinazie (ongeveer 200 g)", "zakken spinazie (ongeveer 200 g)", 6, "Gebruik de rest in soep, pasta of een omelet.") },
  kiwi: { per: 2, ...st },
  cucumber: { per: 0.5, ...st, heel: heel("hele komkommer", "hele komkommers", 1, "De rest is lekker als snack of in je waterfles.") },
  apple: { per: 1, ...st },
  lime: { per: 0.5, ...st, heel: heel("hele limoen", "hele limoenen", 1, "De rest kun je in je water doen.") },
  carrot: { per: 2, ...st },
  pineapple: { per: 2, enk: "plak", mv: "plakken", heel: heel("hele ananas", "hele ananassen", 10, "Snij de rest in stukjes en bewaar ze in de koelkast, of vries ze in.") },
  turmeric: { per: 1, enk: "cm", mv: "cm", heel: heel("stukje kurkuma van ongeveer 6 cm", "stukjes kurkuma van ongeveer 6 cm", 6, "Kurkuma kun je invriezen.") },
  pepper: { per: 1, enk: "snufje", mv: "snufjes" },
  blueberry: { per: 1, ...hd, heel: heel("bakje blauwe bessen (125 g)", "bakjes blauwe bessen (125 g)", 3, "Eet de rest door je yoghurt of ontbijt.") },
  banana: { per: 2, ...st },
  cacao: { per: 1, enk: "eetlepel", mv: "eetlepels" },
  celery: { per: 2, enk: "stengel", mv: "stengels", heel: heel("bos bleekselderij", "bossen bleekselderij", 10, "Gebruik de rest in soep, of als snack met hummus.") },
  fennel: { per: 0.5, enk: "knol", mv: "knollen", heel: heel("hele venkelknol", "hele venkelknollen", 1, "De rest is lekker in een salade of uit de oven.") },
  strawberry: { per: 1, ...hd, heel: heel("bakje aardbeien (250 g)", "bakjes aardbeien (250 g)", 6, "Eet de rest zo, of vries ze in.") },
  pear: { per: 1, ...st },
  avocado: { per: 0.5, ...st, heel: heel("hele avocado", "hele avocado's", 1, "Bewaar de rest met een druppel citroen.") },
  mango: { per: 0.5, ...st, heel: heel("hele mango", "hele mango's", 1, "De rest is lekker als tussendoortje.") },
  cherry: { per: 1, ...hd },
  watermelon: { per: 2, enk: "plak", mv: "plakken", heel: heel("stuk watermeloen (ongeveer een kwart)", "stukken watermeloen (ongeveer een kwart)", 8, "De rest is lekker als tussendoortje.") },
  redpepper: { per: 1, ...st },
  parsley: { per: 1, enk: "klein bosje", mv: "kleine bosjes" },
  lemon: { per: 0.5, ...st, heel: heel("hele citroen", "hele citroenen", 1, "De rest kun je in je water doen.") },
  raspberry: { per: 1, ...hd, heel: heel("bakje frambozen (125 g)", "bakjes frambozen (125 g)", 3, "Eet de rest door je yoghurt of ontbijt.") },
  mint: { per: 5, enk: "blaadje", mv: "blaadjes", heel: heel("bosje munt", "bosjes munt", 40, "Zet de rest in een glas water, of maak er thee van.") },
  kale: { per: 1, ...hd, heel: heel("zak boerenkool (ongeveer 200 g)", "zakken boerenkool (ongeveer 200 g)", 6, "Gebruik de rest in soep of een stamppot.") },
  grape: { per: 1, ...hd },
  papaya: { per: 0.25, ...st, heel: heel("hele papaja", "hele papaja's", 1, "De rest is lekker als ontbijt.") },
  apricot: { per: 3, ...st },
  grapefruit: { per: 1, ...st },
  tomato: { per: 2, ...st },
  pumpkinseed: { per: 1, enk: "eetlepel", mv: "eetlepels", heel: heel("zakje pompoenpitten", "zakjes pompoenpitten", 50, "Een zakje is genoeg voor weken.") },
  almond: { per: 1, ...hd, heel: heel("zakje amandelen", "zakjes amandelen", 8, "Een zakje is genoeg voor een paar weken.") },
  date: { per: 3, ...st },
  cinnamon: { per: 1, enk: "snufje", mv: "snufjes" },
  fig: { per: 2, ...st },
};

function fmt(n: number): string {
  const hele = Math.floor(n + 1e-9);
  const rest = Math.round((n - hele) * 4) / 4;
  const frac = rest === 0.25 ? "¼" : rest === 0.5 ? "½" : rest === 0.75 ? "¾" : "";
  if (!frac) return String(hele);
  return hele === 0 ? frac : `${hele}${frac}`;
}

/** hoeveelheid die je nodig hebt, en wat je daarvoor koopt */
export function hoeveelheid(id: string, sapjes: number): { nodig: string; koop?: string; rest?: string } {
  const p = PORTIE[id];
  if (!p) return { nodig: AMT[id] ?? "" };
  const totaal = p.per * sapjes;
  const nodig = sapjes === 1 && AMT[id] ? AMT[id] : `${fmt(totaal)} ${totaal <= 1 ? p.enk : p.mv}`;
  if (!p.heel) return { nodig };
  const c = Math.max(1, Math.ceil(totaal / p.heel.per - 1e-9));
  const koop = `${c} ${c === 1 ? p.heel.enk : p.heel.mv}`;
  const over = c * p.heel.per > totaal + 1e-9;
  return { nodig, koop, rest: over ? p.heel.rest : undefined };
}

export const BEWAAR: Record<"mixer" | "slowjuicer" | "beide", string> = {
  mixer: "Een smoothie uit de blender drink je het best dezelfde dag, uiterlijk binnen 24 uur. Maak er dus liever steeds één.",
  slowjuicer: "Sap uit een slowjuicer houdt het best 1 tot 2 dagen in de koelkast, hooguit 3 dagen. Twijfel je? Drink het dan eerder.",
  beide: "Sap uit een slowjuicer houdt het best 1 tot 2 dagen in de koelkast, hooguit 3 dagen. Een smoothie uit de blender drink je dezelfde dag, uiterlijk binnen 24 uur.",
};

/** korte regel bij het sapje zelf */
export const HOUDBAAR: Record<"mixer" | "slowjuicer" | "beide", string> = {
  mixer: "Blender: vandaag drinken.",
  slowjuicer: "Slowjuicer: tot 2 dagen in de koelkast.",
  beide: "Blender: vandaag drinken. Slowjuicer: tot 2 dagen in de koelkast.",
};

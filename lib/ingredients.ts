import type { PhaseId } from "./data";

export type Ingredient = {
  id: string;
  naam: string;
  kleur: string;
  reden: string;
  waarschuwing?: string;
  /** soort, om te zorgen dat elke set een goede mix heeft */
  soort: "fruit" | "groente" | "kruid" | "zaad";
  /** gelijksoortige ingrediënten komen nooit samen in één set */
  groep?: string;
  rond?: boolean; // rolt weg
  klein?: boolean; // valt als kleine korrels/pitjes mee
  snede?: string; // bestandsnaam van de doorgesneden variant
  /** hoeveel sap het geeft in een slow juicer: 0 geen, 1 weinig, 2 gemiddeld, 3 veel */
  sap?: number;
  /** pers = slow juicer, mix = blender, toevoegen = erbij strooien of roeren */
  bereiding?: "pers" | "mix" | "toevoegen";
};

export const ING: Record<string, Ingredient> = {
  beet: { id: "beet", naam: "Rode biet", kleur: "#8E1B3A", soort: "groente", rond: true, reden: "Levert ijzer en foliumzuur en geeft het sapje zijn diepe kleur." },
  pomegranate: { id: "pomegranate", naam: "Granaatappel", kleur: "#B0213F", soort: "fruit", rond: true, snede: "pomegranateCut", reden: "Rijk aan antioxidanten." },
  orange: { id: "orange", naam: "Sinaasappel", kleur: "#F28C28", soort: "fruit", groep: "citrus", rond: true, snede: "orangeCut", reden: "Vitamine C, die helpt om plantaardig ijzer op te nemen." },
  ginger: { id: "ginger", naam: "Gember", kleur: "#D9B25A", soort: "kruid", groep: "specerij", reden: "Verwarmend en wordt van oudsher gebruikt bij krampen en misselijkheid.", waarschuwing: "Gebruik je bloedverdunners? Vraag het eerst aan je huisarts of apotheker." },
  spinach: { id: "spinach", naam: "Spinazie", kleur: "#3F8F4E", soort: "groente", groep: "blad", reden: "Foliumzuur, ijzer en magnesium." },
  kiwi: { id: "kiwi", naam: "Kiwi", kleur: "#8DB255", soort: "fruit", rond: true, reden: "Veel vitamine C en vezels." },
  cucumber: { id: "cucumber", naam: "Komkommer", kleur: "#4E8F4A", soort: "groente", rond: true, reden: "Bestaat vooral uit water en houdt je gehydrateerd." },
  apple: { id: "apple", naam: "Appel", kleur: "#A7C957", soort: "fruit", groep: "pitvrucht", rond: true, reden: "Vezels en een milde zoetheid." },
  lime: { id: "lime", naam: "Limoen", kleur: "#5E9B2E", soort: "fruit", groep: "citrus", rond: true, snede: "limeCut", reden: "Vitamine C en een frisse smaak." },
  carrot: { id: "carrot", naam: "Wortel", kleur: "#E8731A", soort: "groente", reden: "Bètacaroteen, dat je lichaam omzet in vitamine A." },
  pineapple: { id: "pineapple", naam: "Ananas", kleur: "#F3C03B", soort: "fruit", rond: true, reden: "Vitamine C en bromelaïne, een enzym dat eiwitten helpt verteren." },
  turmeric: { id: "turmeric", naam: "Kurkuma", kleur: "#D9981E", soort: "kruid", groep: "specerij", reden: "Bevat curcumine, een antioxidant.", waarschuwing: "Heb je galstenen of gebruik je medicijnen? Vraag eerst je huisarts." },
  pepper: { id: "pepper", naam: "Zwarte peper", kleur: "#2E1428", soort: "kruid", klein: true, reden: "Helpt je lichaam kurkuma beter op te nemen." },
  blueberry: { id: "blueberry", naam: "Blauwe bes", kleur: "#3B2A78", soort: "fruit", groep: "bes", rond: true, reden: "Antioxidanten en vezels." },
  banana: { id: "banana", naam: "Banaan", kleur: "#F3D36B", soort: "fruit", reden: "Vitamine B6 en kalium; maakt je sapje lekker vol." },
  cacao: { id: "cacao", naam: "Rauwe cacao", kleur: "#6B3A2A", soort: "kruid", rond: true, snede: "cacaoCut", reden: "Bevat magnesium en ijzer." },
  celery: { id: "celery", naam: "Selderij", kleur: "#A8CF74", soort: "groente", groep: "stengel", reden: "Bestaat vooral uit water: licht en vochtrijk." },
  fennel: { id: "fennel", naam: "Venkel", kleur: "#CFE0A6", soort: "groente", groep: "stengel", reden: "Wordt van oudsher gebruikt tegen gas en een opgeblazen gevoel (er is weinig onderzoek bij mensen)." },
  strawberry: { id: "strawberry", naam: "Aardbei", kleur: "#E23D4F", soort: "fruit", groep: "bes", rond: true, reden: "Veel vitamine C." },
  pear: { id: "pear", naam: "Peer", kleur: "#C6D65A", soort: "fruit", groep: "pitvrucht", reden: "Vezels en mild zoet; vaak zacht voor je buik." },
  avocado: { id: "avocado", naam: "Avocado", kleur: "#7FA33A", soort: "fruit", reden: "Gezonde vetten, foliumzuur en vitamine E." },
  mango: { id: "mango", naam: "Mango", kleur: "#F7B42C", soort: "fruit", groep: "tropisch", rond: true, reden: "Vitamine C en bètacaroteen." },
  cherry: { id: "cherry", naam: "Kers", kleur: "#C2183B", soort: "fruit", groep: "bes", rond: true, reden: "Antioxidanten en een frisse, zoete smaak." },
  watermelon: { id: "watermelon", naam: "Watermeloen", kleur: "#F0485A", soort: "fruit", reden: "Bestaat vooral uit water: verfrissend en vochtrijk." },
  redpepper: { id: "redpepper", naam: "Rode paprika", kleur: "#D9262C", soort: "groente", reden: "Zeer rijk aan vitamine C." },
  parsley: { id: "parsley", naam: "Peterselie", kleur: "#3F8F4E", soort: "groente", groep: "blad", reden: "Bevat ijzer en vitamine C." },
  lemon: { id: "lemon", naam: "Citroen", kleur: "#F7DC3C", soort: "fruit", groep: "citrus", rond: true, reden: "Vitamine C en een frisse zuurgraad." },
  raspberry: { id: "raspberry", naam: "Framboos", kleur: "#D81B60", soort: "fruit", groep: "bes", rond: true, reden: "Vezels, vitamine C en antioxidanten." },
  mint: { id: "mint", naam: "Munt", kleur: "#4CAF50", soort: "kruid", reden: "Verfrissend; wordt van oudsher gebruikt bij een onrustige maag." },
  kale: { id: "kale", naam: "Boerenkool", kleur: "#2F6E3B", soort: "groente", groep: "blad", reden: "Vitamine C, foliumzuur en een beetje calcium." },
  grape: { id: "grape", naam: "Groene druif", kleur: "#B9DA6A", soort: "fruit", rond: true, reden: "Natuurlijke suikers voor snelle energie." },
  papaya: { id: "papaya", naam: "Papaja", kleur: "#F28A22", soort: "fruit", groep: "tropisch", reden: "Vitamine C en papaïne, een enzym dat de spijsvertering kan helpen." },
  apricot: { id: "apricot", naam: "Abrikoos", kleur: "#F7A93A", soort: "fruit", rond: true, reden: "Bètacaroteen en vezels." },
  grapefruit: { id: "grapefruit", naam: "Grapefruit", kleur: "#F2677A", soort: "fruit", groep: "citrus", rond: true, snede: "grapefruitCut", reden: "Vitamine C.", waarschuwing: "Kan de werking van sommige medicijnen beïnvloeden. Lees je bijsluiter." },
  tomato: { id: "tomato", naam: "Tomaat", kleur: "#E03A2E", soort: "groente", rond: true, reden: "Lycopeen (een antioxidant) en vitamine C." },
  pumpkinseed: { id: "pumpkinseed", naam: "Pompoenpitten", kleur: "#7FA33A", soort: "zaad", groep: "zaad", klein: true, reden: "Bevatten zink en magnesium." },
  almond: { id: "almond", naam: "Amandel", kleur: "#A8672F", soort: "zaad", groep: "zaad", klein: true, reden: "Magnesium en vitamine E." },
  date: { id: "date", naam: "Dadel", kleur: "#6B3A22", soort: "fruit", reden: "Natuurlijk zoet, met vezels en kalium." },
  cinnamon: { id: "cinnamon", naam: "Kaneel", kleur: "#B5702F", soort: "kruid", groep: "specerij", reden: "Geeft warme zoetheid zonder extra suiker." },
  fig: { id: "fig", naam: "Vijg", kleur: "#6B3A6E", soort: "fruit", reden: "Vezels en een beetje calcium." },
};

/* Elke combinatie hieronder is gebaseerd op bestaande sap- en smoothierecepten, zodat de
   ingrediënten ook echt bij elkaar passen. Per fase wisselt Juna tussen deze combinaties. */
export const COMBOS: Record<PhaseId, string[][]> = {
  menstruatie: [
    ["beet", "orange", "ginger", "carrot"],
    ["beet", "apple", "ginger", "orange"],
    ["beet", "celery", "apple", "ginger"],
    ["beet", "apple", "lemon", "ginger"],
    ["beet", "pomegranate", "orange", "ginger"],
    ["orange", "carrot", "apple", "ginger"],
    ["celery", "apple", "orange", "ginger"],
    ["watermelon", "cherry", "strawberry", "lemon"],
    ["pomegranate", "watermelon", "strawberry", "raspberry"],
    ["cherry", "pomegranate", "watermelon", "lemon"],
    ["pomegranate", "orange", "pineapple", "lemon"],
    ["orange", "pineapple", "strawberry", "lemon"],
    ["spinach", "orange", "pineapple", "apple"],
    ["spinach", "parsley", "celery", "apple"],
    ["redpepper", "carrot", "orange", "apple"],
  ],
  folliculair: [
    ["spinach", "cucumber", "apple", "mint"],
    ["spinach", "kiwi", "cucumber", "apple"],
    ["fennel", "apple", "cucumber", "lime"],
    ["cucumber", "mint", "pear", "lime"],
    ["celery", "cucumber", "apple", "lime"],
    ["kale", "celery", "apple", "cucumber"],
    ["fennel", "grape", "apple", "mint"],
    ["pineapple", "cucumber", "mint", "lime"],
    ["kiwi", "grape", "apple", "lime"],
    ["avocado", "spinach", "pear", "lime"],
    ["kale", "pear", "cucumber", "lime"],
    ["spinach", "pineapple", "orange", "kiwi"],
    ["celery", "cucumber", "fennel", "mint"],
  ],
  ovulatie: [
    ["carrot", "orange", "apricot", "turmeric"],
    ["carrot", "pineapple", "orange", "turmeric"],
    ["pineapple", "mango", "orange", "turmeric"],
    ["carrot", "orange", "mango", "turmeric"],
    ["carrot", "orange", "mango", "apricot"],
    ["grapefruit", "orange", "carrot", "pineapple"],
    ["pineapple", "mango", "papaya", "orange"],
    ["strawberry", "pineapple", "orange", "mango"],
    ["tomato", "carrot", "redpepper", "orange"],
    ["redpepper", "carrot", "orange", "turmeric"],
    ["blueberry", "strawberry", "orange", "mango"],
    ["carrot", "orange", "mango", "pumpkinseed"],
  ],
  luteaal: [
    ["banana", "cacao", "almond", "date"],
    ["blueberry", "banana", "spinach", "cacao"],
    ["blueberry", "banana", "date", "spinach"],
    ["banana", "spinach", "cacao", "date"],
    ["banana", "almond", "date", "cinnamon"],
    ["pear", "apple", "ginger", "cinnamon"],
    ["fennel", "pear", "mint", "ginger"],
    ["raspberry", "banana", "cacao", "almond"],
    ["fig", "banana", "almond", "cinnamon"],
    ["papaya", "pear", "mint", "ginger"],
    ["avocado", "spinach", "banana", "cacao"],
    ["blueberry", "raspberry", "banana", "almond"],
    ["cacao", "raspberry", "banana", "date"],
  ],
};

/** Standaardhoeveelheid per ingrediënt, voor het boodschappenlijstje. */
export const AMT: Record<string, string> = {"beet": "1 middelgrote", "pomegranate": "½ stuk", "orange": "2 stuks", "ginger": "2 cm", "spinach": "1 handje", "kiwi": "2 stuks", "cucumber": "½ stuk", "apple": "1 stuk", "lime": "½ stuk", "carrot": "2 stuks", "pineapple": "2 plakken", "turmeric": "1 cm", "pepper": "snufje", "blueberry": "1 handje", "banana": "2 stuks", "cacao": "1 eetlepel", "celery": "2 stengels", "fennel": "½ knol", "strawberry": "1 handje", "pear": "1 stuk", "avocado": "½ stuk", "mango": "½ stuk", "cherry": "1 handje", "watermelon": "2 plakken", "redpepper": "1 stuk", "parsley": "klein bosje", "lemon": "½ stuk", "raspberry": "1 handje", "mint": "5 blaadjes", "kale": "1 handje", "grape": "1 handje", "papaya": "¼ stuk", "apricot": "3 stuks", "grapefruit": "1 stuk", "tomato": "2 stuks", "pumpkinseed": "1 eetlepel", "almond": "1 handje", "date": "3 stuks", "cinnamon": "snufje", "fig": "2 stuks"};

/* sap-gehalte en bereiding per ingrediënt */
const SAP: Record<string, [number, "pers" | "mix" | "toevoegen"]> = {
  orange: [3, "pers"], apple: [3, "pers"], pineapple: [3, "pers"], grapefruit: [3, "pers"], lemon: [3, "pers"], lime: [3, "pers"],
  cucumber: [3, "pers"], celery: [3, "pers"], watermelon: [3, "pers"], carrot: [3, "pers"], tomato: [3, "pers"], grape: [3, "pers"], pear: [3, "pers"],
  pomegranate: [2, "pers"], kiwi: [2, "pers"], cherry: [2, "pers"], strawberry: [2, "pers"], redpepper: [2, "pers"], beet: [2, "pers"], fennel: [2, "pers"],
  apricot: [1, "pers"], raspberry: [1, "pers"], blueberry: [1, "pers"], spinach: [1, "pers"], kale: [1, "pers"], parsley: [1, "pers"], mint: [1, "pers"],
  ginger: [1, "pers"], turmeric: [1, "pers"], papaya: [1, "mix"],
  mango: [0, "mix"], banana: [0, "mix"], avocado: [0, "mix"], fig: [0, "mix"], date: [0, "mix"], almond: [0, "mix"],
  cacao: [0, "toevoegen"], cinnamon: [0, "toevoegen"], pepper: [0, "toevoegen"], pumpkinseed: [0, "toevoegen"],
};
for (const [id, [sap, bereiding]] of Object.entries(SAP)) {
  if (ING[id]) {
    ING[id].sap = sap;
    ING[id].bereiding = bereiding;
  }
}

/* ---------- vaste "willekeurigheid" (zelfde invoer = zelfde uitkomst) ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const zonderPeper = (a: string[]) => a.filter((x) => x !== "pepper");
function overlap(a: string[], b: string[]) {
  return zonderPeper(a).filter((x) => zonderPeper(b).includes(x)).length;
}
const zelfde = (a0: string[], b0: string[]) => {
  const a = zonderPeper(a0), b = zonderPeper(b0);
  return a.length === b.length && a.every((x) => b.includes(x));
};

/** Kiest een combinatie. `vermijd` zijn eerdere sets waar de nieuwe duidelijk van moet verschillen. */
export function beschikbaar(phase: PhaseId, uitgesloten: string[] = [], vast?: string | null): string[][] {
  const zonder = COMBOS[phase].filter((c) => !c.some((id) => uitgesloten.includes(id)));
  if (!vast) return zonder;
  const met = zonder.filter((c) => c.includes(vast));
  return met.length ? met : zonder; // past het vastgezette ingrediënt niet in deze fase, dan negeren we het
}

/** In welke fase komt dit ingrediënt wel voor? (voor het berichtje "komt terug in ...") */
export function fasesMet(id: string): PhaseId[] {
  return (Object.keys(COMBOS) as PhaseId[]).filter((p) => COMBOS[p].some((c) => c.includes(id)));
}

export function kiesSet(phase: PhaseId, seedText: string, vermijd: string[][] = [], uitgesloten: string[] = [], vast?: string | null): string[] {
  const combos = beschikbaar(phase, uitgesloten, vast);
  if (!combos.length) return [];
  const r = rng(hash(seedText));
  const volgorde = combos.map((c, i) => ({ c, k: r() + i * 0 })).sort((x, y) => x.k - y.k).map((x) => x.c);
  const laatste = vermijd[vermijd.length - 1];
  const kandidaat =
    volgorde.find((c) => !vermijd.some((v) => zelfde(v, c)) && (!laatste || overlap(c, laatste) <= 2)) ??
    volgorde.find((c) => !vermijd.some((v) => zelfde(v, c))) ??
    volgorde[0];
  return metPeper(kandidaat, uitgesloten);
}

/** Zwarte peper hoort alleen bij kurkuma, en komt dan altijd als 5e onderaan. */
export function metPeper(set: string[], uitgesloten: string[] = []): string[] {
  const kern = set.filter((id) => id !== "pepper");
  return kern.includes("turmeric") && !uitgesloten.includes("pepper") ? [...kern, "pepper"] : kern;
}

export function weekId(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}

function vorigeWeek(d = new Date()) {
  const p = new Date(d);
  p.setDate(p.getDate() - 7);
  return weekId(p);
}

/** De vaste set van deze week: elke week anders, binnen de week hetzelfde. */
export function weekSet(phase: PhaseId, uitgesloten: string[] = [], vast?: string | null, d = new Date()): string[] {
  const vorige = kiesSet(phase, `${vorigeWeek(d)}:${phase}`, [], uitgesloten);
  return kiesSet(phase, `${weekId(d)}:${phase}`, [vorige], uitgesloten, vast);
}

/** Een nieuwe set na een tik op "Schud opnieuw". */
export function schudSet(phase: PhaseId, eerder: string[][], uitgesloten: string[] = [], vast?: string | null): string[] {
  return kiesSet(phase, `${Math.random()}:${Date.now()}:${phase}`, eerder.slice(-3), uitgesloten, vast);
}

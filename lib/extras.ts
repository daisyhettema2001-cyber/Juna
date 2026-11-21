import { ING } from "./ingredients";

export type ExtraDoel = "huid" | "haar";

export type Topping = { id: string; reden: string };

/* Toevoegingen voor je sapje. De reden zegt alleen wat erin zit, nooit wat het doet. */
export const TOPPINGS: Record<ExtraDoel, Topping[]> = {
  huid: [
    { id: "avocado", reden: "Bevat vitamine E en gezonde vetten. Maakt je sapje ook romiger." },
    { id: "kiwi", reden: "Bevat veel vitamine C." },
    { id: "carrot", reden: "Bevat bètacaroteen, dat je lichaam omzet in vitamine A." },
    { id: "cucumber", reden: "Bestaat vooral uit water. Fijn fris." },
    { id: "orange", reden: "Bevat vitamine C." },
    { id: "redpepper", reden: "Bevat veel vitamine C." },
    { id: "mango", reden: "Bevat vitamine C en bètacaroteen." },
    { id: "strawberry", reden: "Bevat veel vitamine C." },
    { id: "apricot", reden: "Bevat bètacaroteen en vezels." },
    { id: "tomato", reden: "Bevat lycopeen, een antioxidant, en vitamine C." },
  ],
  haar: [
    { id: "pumpkinseed", reden: "Bevat zink. Strooi ze over je glas." },
    { id: "almond", reden: "Bevat eiwit, vitamine E en een beetje biotine." },
    { id: "spinach", reden: "Bevat ijzer. Je proeft het bijna niet." },
    { id: "kale", reden: "Bevat ijzer en vitamine C." },
    { id: "beet", reden: "Bevat ijzer en foliumzuur. Geeft je sapje een mooie kleur." },
    { id: "parsley", reden: "Bevat ijzer en vitamine C." },
    { id: "cacao", reden: "Bevat magnesium en ijzer. Lekker bij een zoet sapje." },
  ],
};

/* Alleen goed te maken in een blender (te dik voor een slowjuicer) */
const ALLEEN_BLENDER = ["avocado", "mango", "almond", "papaya"];

const heeft = (set: string[], ids: string[]) => ids.some((i) => set.includes(i));

/* Smaakregels: een toevoeging wordt alleen voorgesteld als hij bij het sapje past. */
const PAST: Record<string, (set: string[]) => boolean> = {
  tomato: (s) => heeft(s, ["carrot", "beet", "celery", "redpepper"]),
  cacao: (s) => heeft(s, ["banana", "blueberry", "strawberry", "raspberry", "cherry", "date", "orange", "apple", "pear", "pomegranate", "fig"]),
  parsley: (s) => heeft(s, ["apple", "lemon", "cucumber", "carrot", "celery", "pear"]),
  redpepper: (s) => heeft(s, ["carrot", "orange", "tomato", "apple", "celery", "cucumber"]),
  beet: (s) => heeft(s, ["apple", "orange", "carrot", "lemon", "ginger", "pomegranate"]),
  spinach: (s) => !heeft(s, ["kale"]),
  kale: (s) => !heeft(s, ["spinach"]),
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/* Eén tip die bij dit sapje past. Schud je het sapje, dan kan de tip veranderen. */
export function kiesPimp(doel: ExtraDoel, set: string[], uitgesloten: string[], machine: "beide" | "mixer" | "slowjuicer"): Topping | null {
  const kandidaten = TOPPINGS[doel].filter(
    (t) =>
      ING[t.id] &&
      !uitgesloten.includes(t.id) &&
      !set.includes(t.id) &&
      (PAST[t.id]?.(set) ?? true) &&
      !(machine === "slowjuicer" && ALLEEN_BLENDER.includes(t.id)),
  );
  if (!kandidaten.length) return null;
  return kandidaten[hash(`${set.join(",")}:${doel}`) % kandidaten.length];
}

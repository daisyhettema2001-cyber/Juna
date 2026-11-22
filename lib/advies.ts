import { ING } from "./ingredients";

export type Machine = "beide" | "mixer" | "slowjuicer";

export type Advies = {
  /** kleine vaste tip onder de ingrediënten */
  tip: string;
  /** alleen gevuld als er een pop-up getoond moet worden */
  popup?: { titel: string; tekst: string };
};

function lijst(namen: string[]) {
  return namen.length > 1 ? `${namen.slice(0, -1).join(", ")} en ${namen[namen.length - 1]}` : namen[0] ?? "";
}

const ROMIG = ["banana", "avocado", "date", "almond", "cacao", "fig", "cinnamon"];

/** Hoeveel sap geeft deze set in totaal? (0 tot 12) */
export function sapPunten(ids: string[]) {
  return ids.reduce((n, id) => n + (ING[id]?.sap ?? 0), 0);
}

export function advies(ids: string[], machine: Machine, uitgesloten: string[] = []): Advies {
  const ings = ids.map((id) => ING[id]);
  const zacht = ings.filter((i) => i.bereiding === "mix"); // gaat niet door een slow juicer
  const poeder = ings.filter((i) => i.bereiding === "toevoegen");
  const punten = sapPunten(ids);
  const weinigSap = punten < 6;
  const romig = ids.some((id) => ROMIG.includes(id));
  const opties = (romig
    ? [["kokos", "kokosmelk"], ["almond", "amandelmelk"], ["melk", "melk"], ["", "water"]]
    : [["", "water"], ["kokos", "kokoswater"]]
  ).filter(([id]) => !id || !uitgesloten.includes(id));
  const vloeistof = lijst(opties.map(([, naam]) => naam)).replace(/ en ([^ ]+)$/, " of $1");
  const zachtNamen = lijst(zacht.map((i) => i.naam.toLowerCase()));
  const bladNamen = ings.filter((i) => i.groep === "blad" || i.id === "parsley" || i.id === "mint").map((i) => i.naam.toLowerCase());

  const blenderSet = zacht.length >= 2 || weinigSap;
  // Bijna alleen stevige ingrediënten (bijv. cacao, dadel, amandel, framboos): dat wordt een dikke smoothie.
  const stevig = punten <= 3 || zacht.length + poeder.length >= 3;

  // De kleine tip onderaan
  let tip: string;
  if (stevig) {
    tip =
      machine === "slowjuicer"
        ? `Dit geeft bijna geen sap. Roer er ongeveer 200 ml ${vloeistof} door, of maak er een smoothie van.`
        : `Dit wordt een dikke smoothie. Mix met ongeveer 200 ml ${vloeistof}.`;
  } else if (machine === "mixer") {
    tip = blenderSet
      ? `Voor de blender: mix alles met een scheut ${vloeistof}.`
      : `Voor de blender: mix alles met een glas ${vloeistof} en zeef eventueel. Dan wordt het een smoothie.`;
  } else if (machine === "slowjuicer") {
    tip = weinigSap
      ? `Voor de slow juicer: dit geeft weinig sap. Roer er ${vloeistof} door.`
      : zacht.length
        ? `Voor de slow juicer: pers de rest en prak ${zachtNamen} fijn door het sap.`
        : "Voor de slow juicer: pers alles en drink het meteen.";
  } else {
    tip = blenderSet
      ? `Past het best bij een blender. In een slow juicer geeft dit weinig sap, voeg dan ${vloeistof} toe.`
      : "Past het best bij een slow juicer. In een blender lukt het ook: voeg een scheut water toe.";
  }
  if (poeder.length) {
    const pn = lijst(poeder.map((i) => i.naam.toLowerCase()));
    tip += ` ${pn.charAt(0).toUpperCase() + pn.slice(1)}: roer erdoor als poeder of fijn gehakt.`;
  }

  // Pop-up: alleen voor wie een slow juicer heeft maar geen blender
  let popup: Advies["popup"];
  if (machine === "slowjuicer" && (weinigSap || zacht.length >= 2)) {
    const delen: string[] = [];
    if (zacht.length) delen.push(`${zachtNamen.charAt(0).toUpperCase() + zachtNamen.slice(1)} ${zacht.length > 1 ? "geven" : "geeft"} geen sap in een slow juicer.`);
    if (bladNamen.length && weinigSap) delen.push("Bladgroen en kruiden geven ook weinig sap.");
    const sap = ["apple", "orange"].filter((id) => !uitgesloten.includes(id)).map((id) => (id === "apple" ? "appel" : "sinaasappel"));
    delen.push(`Tip: voeg ${vloeistof} toe${sap.length ? `, of een geperst sap van ${sap.join(" of ")},` : ""} zodat het echt een drankje wordt.`);
    popup = { titel: "Tip voor je slow juicer", tekst: delen.join(" ") };
  }
  return { tip, popup };
}

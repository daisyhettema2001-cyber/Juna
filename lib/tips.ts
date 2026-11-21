import type { PhaseId } from "./data";
import { weekId } from "./ingredients";

export type Tip = { soort: string; tekst: string; /** ingrediënten die in de tip genoemd worden */ bevat?: string[] };

/* Voorzichtig geformuleerd: voor wisselen van eten of sport per cyclusfase is weinig bewijs.
   Daarom "veel mensen ervaren" en "kan helpen" in plaats van beloftes. */
export const TIPS: Record<PhaseId, Tip[]> = {
  menstruatie: [
    { soort: "Ritueel", tekst: "Een warm kruikje op je buik is voor veel mensen prettig bij krampen." },
    { soort: "Voeding", tekst: "IJzer zit in linzen, kikkererwten en groene bladgroente. Vitamine C erbij, bijvoorbeeld sinaasappel, helpt plantaardig ijzer op te nemen.", bevat: ["orange"] },
    { soort: "Rust", tekst: "Je hoeft nu niets te bewijzen. Plan als het kan een rustige avond en probeer 7 tot 8 uur te slapen." },
    { soort: "Beweging", tekst: "Een wandeling of rustig stretchen voelt voor veel mensen fijn. Luister naar je lichaam." },
    { soort: "Drinken", tekst: "Een warme kop thee, bijvoorbeeld gember, helpt je om genoeg te drinken.", bevat: ["ginger"] },
    { soort: "Huid", tekst: "Je huid kan gevoeliger zijn. Kies milde producten en sla de scrub even over." },
    { soort: "Let op", tekst: "Heel hevige pijn of bloedingen? Praat daarover met je huisarts." },
  ],
  folliculair: [
    { soort: "Energie", tekst: "Na je menstruatie stijgt je oestrogeen weer. Een fijn moment om iets nieuws te starten, als je er zin in hebt." },
    { soort: "Beweging", tekst: "Zin in sporten? Wissel kracht en cardio af. Het bewijs dat een fase bepaalt wat het beste werkt is klein, dus kies wat bij jou past." },
    { soort: "Voeding", tekst: "Eiwit en groenten bij elke maaltijd houden je energie stabiel." },
    { soort: "Huid", tekst: "Smeer het hele jaar zonnebrand (SPF) als je buiten bent." },
    { soort: "Haar", tekst: "Gezond haar heeft eiwit, ijzer en zink nodig. Eet gevarieerd met noten, peulvruchten en groenten.", bevat: ["almond"] },
    { soort: "Rust", tekst: "Vaste slaaptijden helpen je ritme, ook als je je energiek voelt." },
    { soort: "Drinken", tekst: "Komkommer en munt in je waterfles maken drinken makkelijker.", bevat: ["cucumber", "mint"] },
  ],
  ovulatie: [
    { soort: "Huid", tekst: "Rond je ovulatie piekt je oestrogeen. In een overzichtsstudie was de huid dan elastischer dan in de fase ervoor." },
    { soort: "Haar", tekst: "Zink zit in pompoenpitten, noten en peulvruchten. Een gevarieerd eetpatroon is een goede basis voor je haar." },
    { soort: "Beweging", tekst: "Pittig sporten mag als jij je goed voelt. Warm wel goed op." },
    { soort: "Voeding", tekst: "Eet kleurrijk: hoe meer kleuren op je bord, hoe gevarieerder je vitamines." },
    { soort: "Drinken", tekst: "Genoeg water helpt je huid soepel te blijven." },
    { soort: "Let op", tekst: "Sommige mensen voelen rond de eisprong een lichte steek. Warmte kan helpen. Bij hevige pijn: huisarts." },
  ],
  luteaal: [
    { soort: "Rust", tekst: "Genoeg slaap, regelmatig bewegen en gevarieerd eten horen bij wat de NHS adviseert bij PMS-klachten." },
    { soort: "Voeding", tekst: "Sommige mensen vinden vaker kleine maaltijden prettiger voor hun energie en stemming. Probeer het eens uit." },
    { soort: "Voeding", tekst: "Magnesium zit in noten, zaden, groene bladgroente en volkorenbrood. Er is niet veel bewijs dat supplementen bij PMS werken, eet het dus vooral gewoon via je eten.", bevat: ["almond", "pumpkinseed", "spinach"] },
    { soort: "Beweging", tekst: "Yoga, wandelen of zwemmen werken voor veel mensen goed." },
    { soort: "Ontspanning", tekst: "Rustige ademhaling, meditatie of een warm bad kunnen helpen als je gespannen bent." },
    { soort: "Trek in zoet", tekst: "Banaan, dadels of een stukje pure chocolade is prima. Hier past een zoet sapje ook bij.", bevat: ["banana", "date", "cacao"] },
    { soort: "Let op", tekst: "Heftige stemmingsklachten in de dagen voor je menstruatie? Bespreek dat met je huisarts." },
  ],
};

/** Twee tips voor deze week. Ze blijven de hele week gelijk en wisselen daarna door de lijst. */
export function weekTips(phase: PhaseId, uitgesloten: string[] = [], d = new Date()): [Tip, Tip] {
  const lijst = TIPS[phase].filter((t) => !t.bevat?.some((id) => uitgesloten.includes(id)));
  const [jaar, week] = weekId(d).split("-W").map(Number);
  const n = jaar * 53 + week;
  return [lijst[(n * 2) % lijst.length], lijst[(n * 2 + 1) % lijst.length]];
}

export function tipLink(tip: Tip): string | null {
  return null;
}

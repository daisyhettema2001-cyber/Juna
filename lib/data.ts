export type PhaseId = "menstruatie" | "folliculair" | "ovulatie" | "luteaal";

export type Phase = {
  id: PhaseId;
  name: string;
  label: string;
  short: string;
  color: string;
  dark: string;
  tint: string;
  energy: 1 | 2 | 3 | 4;
  hormone: string;
  body: string;
  skin: string;
  hair: string;
  focus: string; // wat Juna in deze fase samenstelt (geen vast sapje)
  recipes: string[]; // recipe slugs, first one = "sap van de week"
};

export type Recipe = {
  slug: string;
  name: string;
  kind: "sap" | "smoothie" | "shot";
  category: "fase" | "glow" | "haar";
  phase?: PhaseId;
  colors: string[];
  minutes: number;
  short: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  why: string;
  whyKort?: string; // korte versie voor de voorpagina
};

export const PHASES: Phase[] = [
  {
    id: "menstruatie",
    name: "Menstruatie",
    label: "Menstruatie",
    short: "Menstr.",
    color: "#C2185B",
    dark: "#9C1148",
    tint: "#FBE3EC",
    energy: 1,
    hormone: "Oestrogeen & progesteron laag",
    body: "Je lichaam ruimt op en verliest ijzer. Rust, warmte en aanvullen staan centraal.",
    skin: "Oestrogeen en progesteron zijn nu laag. Je huid kan droger of gevoeliger aanvoelen. Vochtrijk eten, zoals komkommer en sinaasappel, is een lekkere keuze.",
    hair: "Een gevarieerd eetpatroon met eiwit, ijzer en zink is een goede basis.",
    focus: "Ijzer uit onder andere biet en granaatappel. Daarbij vitamine C, want dat helpt je lichaam ijzer op te nemen. Warme smaken zoals gember.",
    recipes: ["rode-reset", "warme-peer"],
  },
  {
    id: "folliculair",
    name: "Folliculair",
    label: "Folliculaire fase",
    short: "Follic.",
    color: "#3F8F4E",
    dark: "#2F6E3B",
    tint: "#E2F1E0",
    energy: 3,
    hormone: "Oestrogeen stijgt",
    body: "Je energie komt terug en je hebt zin in nieuwe dingen. Licht, fris en groen past nu.",
    skin: "Je oestrogeen stijgt langzaam. Vitamine C draagt bij aan de normale collageenvorming voor je huid, en zit in kiwi en sinaasappel.",
    hair: "Een gevarieerd eetpatroon met eiwit, ijzer en zink is een goede basis.",
    focus: "Vitamine C uit kiwi en citrus, en groene bladgroente zoals spinazie. Licht en fris, passend bij je stijgende energie.",
    recipes: ["groene-start", "citrus-kick"],
  },
  {
    id: "ovulatie",
    name: "Ovulatie",
    label: "Ovulatie",
    short: "Ovulatie",
    color: "#E07A1F",
    dark: "#8F4A0C",
    tint: "#FDEBD6",
    energy: 4,
    hormone: "Oestrogeen piekt",
    body: "Je voelt je vaak op je best en je huid straalt. Houd die glow vast met antioxidanten.",
    skin: "Rond je ovulatie piekt je oestrogeen. In een overzichtsstudie was de huid dan elastischer dan in de fase ervoor. Wortel levert bètacaroteen, dat je lichaam omzet in vitamine A.",
    hair: "Een gevarieerd eetpatroon met eiwit, ijzer en zink is een goede basis.",
    focus: "Bètacaroteen uit onder andere wortel en vitamine C uit citrus en ananas. Daarbij antioxidanten uit kurkuma en zwarte peper.",
    recipes: ["gouden-zon", "rode-bessen-glow"],
  },
  {
    id: "luteaal",
    name: "Luteaal",
    label: "Luteale fase",
    short: "Luteaal",
    color: "#6B4FA8",
    dark: "#553A8F",
    tint: "#ECE5F7",
    energy: 2,
    hormone: "Progesteron hoog",
    body: "Meer trek in zoet, een opgeblazen gevoel of PMS? Kies voor rust en magnesium.",
    skin: "Progesteron is nu hoog, en dat kan je huid vetter maken. Komkommer en munt zijn lekker fris.",
    hair: "Een gevarieerd eetpatroon met eiwit, ijzer en zink is een goede basis.",
    focus: "Magnesium uit onder andere cacao en spinazie, en blauwe bes voor antioxidanten. Rustige, zachte smaken.",
    recipes: ["paarse-kalmte", "zoete-wortel"],
  },
];

export const RECIPES: Recipe[] = [
  {
    slug: "rode-reset",
    name: "Root",
    kind: "sap",
    category: "fase",
    phase: "menstruatie",
    colors: ["#B0213F", "#E8892B", "#D9B25A"],
    minutes: 5,
    short: "Rode biet, granaatappel, sinaasappel, gember",
    ingredients: [
      { name: "Rode biet (rauw)", amount: "1 middelgrote" },
      { name: "Granaatappelpitjes", amount: "100 g" },
      { name: "Sinaasappel", amount: "2" },
      { name: "Verse gember", amount: "2 cm" },
    ],
    steps: [
      "Schil de biet en snijd in stukken.",
      "Pers de sinaasappels uit.",
      "Doe biet, granaatappel en gember door de slowjuicer en meng met het sinaasappelsap.",
    ],
    why: "Biet levert ijzer, de vitamine C uit sinaasappel helpt bij de opname, en gember kan krampen verzachten.",
  },
  {
    slug: "warme-peer",
    name: "Warme Peer",
    kind: "sap",
    category: "fase",
    phase: "menstruatie",
    colors: ["#D9B25A", "#E8892B", "#8C5A2B"],
    minutes: 8,
    short: "Peer, gember, kaneel, citroen",
    ingredients: [
      { name: "Peer", amount: "2" },
      { name: "Verse gember", amount: "2 cm" },
      { name: "Kaneel", amount: "½ tl" },
      { name: "Citroen", amount: "½" },
    ],
    steps: [
      "Juice de peren met de gember.",
      "Verwarm het sap zacht in een pannetje (niet laten koken).",
      "Roer kaneel en een scheutje citroen erdoor en drink lauw.",
    ],
    why: "Lauw en verwarmend; zacht voor je buik op de eerste dagen van je menstruatie.",
  },
  {
    slug: "groene-start",
    name: "Boost",
    kind: "sap",
    category: "fase",
    phase: "folliculair",
    colors: ["#4E8F4A", "#9BC53D", "#D8E8A0"],
    minutes: 5,
    short: "Spinazie, kiwi, komkommer, groene appel, limoen",
    ingredients: [
      { name: "Spinazie", amount: "2 handjes" },
      { name: "Kiwi", amount: "2" },
      { name: "Komkommer", amount: "½" },
      { name: "Groene appel", amount: "1" },
      { name: "Limoen", amount: "½" },
    ],
    steps: [
      "Schil de kiwi's en snijd de appel in partjes.",
      "Juice alles samen met de spinazie en komkommer.",
      "Knijp de limoen erboven uit en drink direct.",
    ],
    why: "Foliumzuur en vitamine C voor je energie, en komkommer houdt je fris en gehydrateerd.",
  },
  {
    slug: "citrus-kick",
    name: "Citrus Kick",
    kind: "sap",
    category: "fase",
    phase: "folliculair",
    colors: ["#F2A93B", "#F06A4A", "#FFD27A"],
    minutes: 5,
    short: "Grapefruit, sinaasappel, wortel",
    ingredients: [
      { name: "Grapefruit", amount: "1" },
      { name: "Sinaasappel", amount: "2" },
      { name: "Wortel", amount: "2" },
    ],
    steps: ["Pers de citrus uit.", "Juice de wortels en meng alles."],
    why: "Fris en vol vitamine C – een frisse start van je dag.",
  },
  {
    slug: "gouden-zon",
    name: "Glow",
    kind: "sap",
    category: "fase",
    phase: "ovulatie",
    colors: ["#E8892B", "#F3D36B", "#C9781A"],
    minutes: 6,
    short: "Wortel, ananas, sinaasappel, kurkuma, zwarte peper",
    ingredients: [
      { name: "Wortel", amount: "3" },
      { name: "Ananas", amount: "2 plakken" },
      { name: "Sinaasappel", amount: "1" },
      { name: "Verse kurkuma", amount: "1 cm" },
      { name: "Zwarte peper", amount: "snufje" },
    ],
    steps: [
      "Juice wortel, ananas en kurkuma.",
      "Pers de sinaasappel erbij uit.",
      "Roer een snufje zwarte peper erdoor.",
    ],
    why: "Bètacaroteen en vitamine C zijn antioxidanten; zwarte peper helpt je lichaam kurkuma op te nemen.",
  },
  {
    slug: "rode-bessen-glow",
    name: "Rode Bessen Glow",
    kind: "smoothie",
    category: "fase",
    phase: "ovulatie",
    colors: ["#D63A5A", "#F06A7A", "#7FB24A"],
    minutes: 4,
    short: "Framboos, aardbei, watermeloen",
    ingredients: [
      { name: "Frambozen", amount: "100 g" },
      { name: "Aardbeien", amount: "100 g" },
      { name: "Watermeloen", amount: "200 g" },
    ],
    steps: ["Doe alles in de blender.", "Mix glad en drink koud."],
    why: "Antioxidanten en veel vocht voor een frisse huid.",
  },
  {
    slug: "paarse-kalmte",
    name: "Cozy",
    kind: "smoothie",
    category: "fase",
    phase: "luteaal",
    colors: ["#3B2A78", "#F3D36B", "#4E8F4A", "#6B3A2A"],
    minutes: 5,
    short: "Blauwe bes, banaan, spinazie, cacao, amandelmelk",
    ingredients: [
      { name: "Blauwe bessen (bevroren)", amount: "150 g" },
      { name: "Banaan", amount: "1" },
      { name: "Spinazie", amount: "1 handje" },
      { name: "Rauwe cacao", amount: "1 el" },
      { name: "Amandelmelk", amount: "250 ml" },
      { name: "Pompoenpitten (topping)", amount: "1 el" },
    ],
    steps: [
      "Doe bessen, banaan, spinazie, cacao en amandelmelk in de blender.",
      "Mix 45 seconden tot het romig is.",
      "Schenk in een glas en strooi de pompoenpitten erover.",
    ],
    why: "In je luteale fase is progesteron hoog en kan je lichaam meer magnesium gebruiken. Cacao en spinazie leveren magnesium en banaan vitamine B6. Of dat PMS-klachten verzacht is niet bewezen, maar het zijn voedzame keuzes die lekker zoet zijn zonder extra suiker.",
    whyKort: "Cacao en spinazie leveren magnesium, banaan vitamine B6. Natuurlijk zoet, zonder extra suiker.",
  },
  {
    slug: "zoete-wortel",
    name: "Zoete Wortel",
    kind: "sap",
    category: "fase",
    phase: "luteaal",
    colors: ["#E07A1F", "#C9D86B", "#8C5A2B"],
    minutes: 5,
    short: "Wortel, appel, gember, kaneel",
    ingredients: [
      { name: "Wortel", amount: "3" },
      { name: "Appel", amount: "1" },
      { name: "Verse gember", amount: "1 cm" },
      { name: "Kaneel", amount: "snufje" },
    ],
    steps: ["Juice wortel, appel en gember.", "Roer de kaneel erdoor."],
    why: "Natuurlijk zoet zonder toegevoegde suiker – fijn als je trek hebt in iets zoets.",
  },
  {
    slug: "glow-shot",
    name: "Glow Shot",
    kind: "shot",
    category: "glow",
    colors: ["#E07A1F", "#F3D36B"],
    minutes: 3,
    short: "Wortel, sinaasappel, kurkuma, zwarte peper",
    ingredients: [
      { name: "Wortel", amount: "2" },
      { name: "Sinaasappel", amount: "1" },
      { name: "Verse kurkuma", amount: "1 cm" },
      { name: "Zwarte peper", amount: "snufje" },
    ],
    steps: ["Juice wortel en kurkuma.", "Pers de sinaasappel erbij en roer de peper erdoor."],
    why: "Bètacaroteen (vitamine A) en vitamine C ondersteunen een gezonde huid.",
  },
  {
    slug: "hydra-roze",
    name: "Hydra Roze",
    kind: "sap",
    category: "glow",
    colors: ["#E8566B", "#9BC53D"],
    minutes: 4,
    short: "Watermeloen, komkommer, munt, limoen",
    ingredients: [
      { name: "Watermeloen", amount: "300 g" },
      { name: "Komkommer", amount: "½" },
      { name: "Verse munt", amount: "5 blaadjes" },
      { name: "Limoen", amount: "½" },
    ],
    steps: ["Juice watermeloen, komkommer en munt.", "Knijp de limoen erboven uit."],
    why: "Veel vocht en verkoelend – fijn als je huid wat vetter of onrustig is.",
  },
  {
    slug: "groene-huid",
    name: "Groene Huid",
    kind: "smoothie",
    category: "glow",
    colors: ["#7FB24A", "#C9D86B"],
    minutes: 4,
    short: "Selderij, peer, avocado, citroen",
    ingredients: [
      { name: "Bleekselderij", amount: "2 stengels" },
      { name: "Peer", amount: "1" },
      { name: "Avocado", amount: "½" },
      { name: "Citroen", amount: "½" },
      { name: "Water", amount: "200 ml" },
    ],
    steps: ["Doe alles in de blender.", "Mix glad, voeg eventueel ijs toe."],
    why: "Gezonde vetten uit avocado en vitamine E helpen je huid soepel te houden.",
  },
  {
    slug: "haar-boost",
    name: "Haar Boost",
    kind: "smoothie",
    category: "haar",
    colors: ["#3F8F4E", "#9BC53D", "#C79A5B"],
    minutes: 4,
    short: "Spinazie, kiwi, appel + pompoenpitten",
    ingredients: [
      { name: "Spinazie", amount: "1 handje" },
      { name: "Kiwi", amount: "2" },
      { name: "Appel", amount: "1" },
      { name: "Water", amount: "150 ml" },
      { name: "Pompoenpitten", amount: "1 el" },
    ],
    steps: ["Mix spinazie, kiwi, appel en water.", "Strooi pompoenpitten erover."],
    why: "IJzer (spinazie), vitamine C (helpt bij ijzeropname) en zink (pompoenpitten) zijn belangrijk voor gezonde haargroei.",
  },
  {
    slug: "sterke-lokken",
    name: "Sterke Lokken",
    kind: "smoothie",
    category: "haar",
    colors: ["#C79A5B", "#F3D36B", "#F4EFE6"],
    minutes: 4,
    short: "Banaan, havermout, amandel, dadel, Griekse yoghurt",
    ingredients: [
      { name: "Banaan", amount: "1" },
      { name: "Havermout", amount: "2 el" },
      { name: "Amandelen", amount: "10" },
      { name: "Dadel", amount: "1" },
      { name: "Griekse yoghurt", amount: "150 g" },
    ],
    steps: ["Doe alles in de blender met een scheut melk.", "Mix romig."],
    why: "Eiwit is de bouwstof van je haar; amandelen leveren biotine en vitamine E.",
  },
  {
    slug: "bessen-wortel",
    name: "Bessen Wortel",
    kind: "smoothie",
    category: "haar",
    colors: ["#8C2F5A", "#E07A1F"],
    minutes: 4,
    short: "Aardbei, framboos, wortel, lijnzaad",
    ingredients: [
      { name: "Aardbeien", amount: "100 g" },
      { name: "Frambozen", amount: "50 g" },
      { name: "Wortelsap", amount: "150 ml" },
      { name: "Gemalen lijnzaad", amount: "1 el" },
    ],
    steps: ["Mix alles glad in de blender."],
    why: "Omega-3 uit lijnzaad en vitamine C uit bessen ondersteunen hoofdhuid en haar.",
  },
];

export function getRecipe(slug: string) {
  return RECIPES.find((r) => r.slug === slug);
}

export function getPhase(id: PhaseId) {
  return PHASES.find((p) => p.id === id)!;
}

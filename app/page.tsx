import Link from "next/link";
import { PHASES, getRecipe } from "@/lib/data";
import { Logo, PhaseIcon } from "@/components/Icons";

const phaseDays: Record<string, string> = {
  menstruatie: "Dag 1–5",
  folliculair: "Dag 6–13",
  ovulatie: "Dag 14–16",
  luteaal: "Dag 17–28",
};

export default function Home() {

  return (
    <div>
      <header className="container site-header">
        <Link href="/" className="brand">
          <Logo />
          juna
        </Link>
        <nav aria-label="Hoofdmenu" className="site-nav">
          <a href="#hoe">Hoe het werkt</a>
          <a href="#fases">De 4 fases</a>
          <a href="#privacy">Jouw data</a>
        </nav>
        <Link href="/app" className="btn btn-dark btn-pill" style={{ minHeight: 46, fontSize: 15 }}>
          Open de app
        </Link>
      </header>

      <main>
        <section className="container hero">
          <div className="hero-copy">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PHASES.map((p) => (
                <span key={p.id} className="chip" style={{ background: p.tint, color: p.dark }}>
                  {p.name}
                </span>
              ))}
            </div>
            <h1>Drink op het ritme van je cyclus.</h1>
            <p className="lead">
              Juna weet in welke fase je zit en geeft je elke week het sapje of de smoothie die daarbij
              past – met uitleg waarom. Plus routines voor een stralende huid en sterk haar.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/app" className="btn btn-dark">
                Probeer Juna gratis
              </Link>
              <a href="#fases" className="btn btn-light">
                Bekijk de 4 fases
              </a>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Werkt in je browser. Op je telefoon: open de app en kies &lsquo;Zet op beginscherm&rsquo;.
            </p>
          </div>

          <div className="hero-visual">
            <div className="blob" style={{ width: 360, height: 360, background: "var(--berry-t)", top: 40, left: "50%", marginLeft: -230 }} />
            <div className="blob" style={{ width: 180, height: 180, background: "var(--orange-t)", bottom: 10, left: "50%", marginLeft: 90 }} />
            <div className="mock-phone">
              <div className="mock-screen">
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Dag 19 · Luteale fase</span>
                <span className="display" style={{ fontSize: 26, lineHeight: 1.05 }}>
                  Jouw sap van deze week
                </span>
                <div style={{ borderRadius: 24, background: "var(--violet)", color: "#fff", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["#3B2A78", "#F3D36B", "#4E8F4A"].map((c) => (
                      <span key={c} className="dot" style={{ width: 44, height: 44, background: c }} />
                    ))}
                  </div>
                  <span className="display" style={{ fontSize: 22 }}>Cozy</span>
                  <span style={{ fontSize: 13, lineHeight: 1.45 }}>
                    Blauwe bes, banaan, spinazie &amp; cacao. Rijk aan magnesium voor de dagen voor je menstruatie.
                  </span>
                </div>
                <div style={{ borderRadius: 20, background: "#fff", padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="eyebrow" style={{ color: "var(--berry-d)" }}>Huid-tip</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>Je huid kan nu wat vetter zijn. Kies vandaag voor komkommer en munt.</span>
                </div>
                <div style={{ borderRadius: 20, background: "var(--green-t)", padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="eyebrow" style={{ color: "var(--green-d)" }}>Haar-tip</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>Strooi pompoenpitten over je smoothie voor extra zink.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="hoe" className="dark-band">
          <div className="container section" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <h2 className="section-title">Zo werkt Juna</h2>
            <div className="grid-auto" style={{ gap: 24 }}>
              {[
                { n: "1", c: "#F59CBD", t: "Vul je cyclus in", d: "Vul de eerste dag van je laatste menstruatie in. Meer heeft Juna niet nodig om te weten in welke fase je zit." },
                { n: "2", c: "#9BD69A", t: "Krijg je sap van de week", d: "Elke fase een nieuw recept, met ingrediënten en een korte uitleg waarom het past bij wat je lichaam nu doet." },
                { n: "3", c: "#F7B66E", t: "Maak je lijstje", d: "Juna zet de boodschappen voor 1, 2 of 3 sapjes voor je klaar, en zegt wat je overhoudt." },
              ].map((s) => (
                <div key={s.n} className="step-card">
                  <span className="display" style={{ fontSize: 48, color: s.c }}>{s.n}</span>
                  <h3 style={{ fontSize: 22 }}>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fases" className="container section" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <h2 className="section-title">Vier fases, vier smaken</h2>
            <p className="lead" style={{ fontSize: 18 }}>
              Je hormonen veranderen gedurende je cyclus, en daarmee ook je energie, je huid en waar je trek
              in hebt. Juna stemt je sapjes daarop af.
            </p>
          </div>
          <div className="grid-auto">
            {PHASES.map((p) => {
              const r = getRecipe(p.recipes[0])!;
              return (
                <Link key={p.id} href={`/app/recept/${r.slug}`} className="phase-card" style={{ background: p.tint }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="phase-icon" style={{ background: p.color }}>
                      <PhaseIcon id={p.id} color="#fff" />
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.dark }}>{phaseDays[p.id]}</span>
                  </div>
                  <h3 className="display" style={{ fontSize: 26 }}>{p.name}</h3>
                  <p style={{ lineHeight: 1.5, fontSize: 15, color: "var(--ink-2)" }}>{p.body}</p>
                  <div className="inner-card">
                    <span className="eyebrow" style={{ color: p.dark }}>
                      {r.kind === "smoothie" ? "Smoothie" : "Sap"} van de fase
                    </span>
                    <span className="display" style={{ fontSize: 20 }}>{r.name}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.45 }}>{r.short}</span>
                    <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted)" }}>Waarom: {r.whyKort ?? r.why}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            De dagen zijn gebaseerd op een cyclus van 28 dagen. Juna past ze automatisch aan op jouw eigen cyclus.
          </p>
        </section>

        <section id="privacy" className="container section" style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 720 }}>
          <h2 className="section-title">Jouw data blijft van jou.</h2>
          <p className="lead" style={{ fontSize: 18 }}>
            Juna werkt los van andere apps. Jij vult zelf je cyclus in en je sapjes schuiven mee als je cyclus verandert.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)" }}>
            In deze testversie blijft alles wat je invult op je eigen toestel.
          </p>
        </section>

        <section style={{ background: "var(--violet)", color: "#fff" }}>
          <div className="container" style={{ paddingTop: 88, paddingBottom: 88, display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: "999 1 480px", minWidth: 0 }}>
              <h2 className="section-title" style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.02 }}>
                Begin gratis. Later: Juna Plus voor alle recepten.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: "#EDE6FA" }}>
                Gratis: je sap van de week. Plus: alle recepten, tips voor je huid en haar, boodschappenlijstjes en
                weekplanning.
              </p>
            </div>
            <Link href="/app" className="btn btn-light btn-pill" style={{ borderColor: "#fff" }}>
              Open de app
            </Link>
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <span className="brand" style={{ fontSize: 22 }}>juna</span>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--muted)", maxWidth: 640 }}>
          Juna geeft voedingsinspiratie en is geen medisch advies. Heb je klachten, een aandoening of gebruik je
          medicijnen? Overleg dan eerst met je huisarts of diëtist. Juna is geen anticonceptiemiddel.
        </p>
      </footer>
    </div>
  );
}

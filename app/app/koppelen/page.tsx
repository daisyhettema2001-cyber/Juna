"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLock } from "@/components/Icons";
import { checkStarts, clearCycle, gemiddelden, loadHistory, saveCycle, saveHistory, useCycle } from "@/lib/cycle";
import DatePicker from "@/components/DatePicker";
import VoorkeurKiezer from "@/components/VoorkeurKiezer";
import VoorkeurTelling from "@/components/VoorkeurTelling";
import { downloadBackup, herstelBackup } from "@/lib/backup";
import { naamStore, wisAlleMijn } from "@/lib/mijn";
import { clearVoorkeuren, saveVoorkeuren, useVoorkeuren } from "@/lib/voorkeuren";

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** De dag in de maand ervoor (zelfde dag, of de laatste dag van die maand). */
function maandErvoor(iso: string) {
  if (!iso) return "";
  const [j, m, d] = iso.split("-").map(Number);
  const t = new Date(j, m - 2, 1);
  const laatste = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(d, laatste));
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
function maandNaam(iso: string) {
  if (!iso) return "";
  const [j, m] = iso.split("-").map(Number);
  return `${MAANDEN[m - 1]} ${j}`;
}

export default function Koppelen() {
  const router = useRouter();
  const cycle = useCycle();
  const { allergie, nietLekker } = useVoorkeuren();
  const [naam, setNaam] = useState("");
  const [start, setStart] = useState("");
  const [today, setToday] = useState<string | undefined>(undefined);
  const [length, setLength] = useState(28);
  const [period, setPeriod] = useState(5);
  const [error, setError] = useState("");
  const [backupMsg, setBackupMsg] = useState("");
  const [eerder, setEerder] = useState<{ start: string; period: string }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(isoDaysAgo(0));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNaam(naamStore.laad());
    if (cycle) {
      setStart(cycle.lastPeriodStart);
      setLength(cycle.cycleLength);
      setPeriod(cycle.periodLength);
      setEerder(loadHistory().map((e) => ({ start: e.start, period: e.periodLength ? String(e.periodLength) : "" })));
    } else if (cycle === null) {
      setStart(isoDaysAgo(14));
    }
  }, [cycle]);

  const starts = [start, ...eerder.map((r) => r.start)].filter(Boolean).sort().reverse();
  const calc = eerder.length
    ? gemiddelden(starts, [period, ...eerder.map((r) => (r.period ? Number(r.period) : undefined))])
    : null;
  const eigenLengte = calc?.cycleLength ?? length;
  const eigenPeriode = calc?.periodLength ?? period;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start) return setError("Vul de eerste dag van je laatste menstruatie in.");
    if (start > isoDaysAgo(0)) return setError("Deze datum ligt in de toekomst.");
    if (eigenLengte < 21 || eigenLengte > 40) return setError("Een cyclus duurt meestal tussen 21 en 40 dagen.");
    if (eigenPeriode < 2 || eigenPeriode > 8) return setError("Een menstruatie duurt meestal 2 tot 8 dagen.");
    if (eerder.some((r) => r.period && (Number(r.period) < 2 || Number(r.period) > 8))) return setError("Een menstruatie duurt meestal 2 tot 8 dagen.");
    if (eerder.some((r) => r.start && r.start >= start)) return setError("Eerdere menstruaties moeten vóór je laatste menstruatie liggen.");
    const alle = [start, ...eerder.map((r) => r.start)];
    if (alle.some((d) => d && d > isoDaysAgo(0))) return setError("Een datum ligt in de toekomst.");
    const fout = checkStarts([...alle].sort().reverse(), isoDaysAgo(0));
    if (fout) return setError(fout);
    naamStore.bewaar(naam.trim().slice(0, 30));
    saveHistory(eerder.map((r) => ({ start: r.start, periodLength: r.period ? Number(r.period) : undefined })));
    saveCycle({ lastPeriodStart: start, cycleLength: eigenLengte, periodLength: eigenPeriode, irregular: calc?.irregular });
    router.push("/app");
  }

  return (
    <main className="app-main">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>Vul je cyclus in</h1>
        <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Juna gebruikt je menstruatiedagen om te bepalen in welke fase je zit, zodat je sapjes automatisch meeschuiven.
        </p>
      </div>

      <form id="cyclus" onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 16, borderRadius: 22 }} noValidate>
        <div className="field">
          <label htmlFor="naam">Hoe mag Juna je noemen? (optioneel)</label>
          <input id="naam" type="text" autoComplete="given-name" maxLength={30} placeholder="Je voornaam" value={naam} onChange={(e) => setNaam(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="start">Eerste dag van je laatste menstruatie</label>
          <DatePicker id="start" value={start} max={today} onChange={setStart} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <strong style={{ fontSize: 15 }}>Eerdere menstruaties (optioneel)</strong>
          <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
            Weet je ook de maanden daarvoor? Voeg ze toe en Juna rekent je gemiddelde cyclus uit. Elke nieuwe rij begint bij de maand ervoor. Pas de dag aan als die niet klopt.
          </span>
          {eerder.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 72px 44px", gap: 8, alignItems: "end" }}>
              <div className="field">
                <label htmlFor={`e${i}`}>{r.start ? `Menstruatie in ${maandNaam(r.start)}` : `${i + 1} ${i === 0 ? "maand" : "maanden"} eerder`}</label>
                <DatePicker id={`e${i}`} value={r.start} max={today} onChange={(v) => setEerder((l) => l.map((x, j) => (j === i ? { ...x, start: v } : x)))} />
              </div>
              <div className="field">
                <label htmlFor={`p${i}`}>Dagen</label>
                <input id={`p${i}`} type="number" inputMode="numeric" min={2} max={8} placeholder="5" value={r.period} onChange={(ev) => setEerder((l) => l.map((x, j) => (j === i ? { ...x, period: ev.target.value } : x)))} />
              </div>
              <button type="button" aria-label={`Verwijder maand ${i + 1}`} onClick={() => setEerder((l) => l.filter((_, j) => j !== i))} style={{ minHeight: 44, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--berry-d)" }}>
                ×
              </button>
            </div>
          ))}
          {eerder.length < 11 && (
            <button type="button" className="btn btn-light" style={{ minHeight: 44, borderRadius: 14, fontSize: 14 }} onClick={() => setEerder((l) => [...l, { start: maandErvoor(l.length ? l[l.length - 1].start || start : start), period: "" }])}>
              Maand eerder toevoegen
            </button>
          )}
          {calc?.cycleLength ? (
            <span role="status" style={{ fontSize: 13, color: "var(--violet-d)", background: "var(--violet-t)", padding: "8px 12px", borderRadius: 12 }}>
              Gemiddeld {calc.cycleLength} dagen per cyclus, berekend uit {calc.aantal} {calc.aantal === 1 ? "cyclus" : "cycli"}.
              {calc.irregular ? " Je cyclus varieert nogal, dus de fase-inschatting is minder zeker." : ""}
            </span>
          ) : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <div className="field">
            <label htmlFor="len">Cyclusduur</label>
            <input id="len" type="number" inputMode="numeric" min={21} max={40} value={eigenLengte} disabled={!!calc?.cycleLength} onChange={(e) => setLength(Number(e.target.value))} aria-describedby="len-hint" />
            <span id="len-hint" className="hint">{calc?.cycleLength ? "berekend uit je maanden" : "dagen (meestal 28)"}</span>
          </div>
          <div className="field">
            <label htmlFor="per">Menstruatie</label>
            <input id="per" type="number" inputMode="numeric" min={2} max={8} value={eigenPeriode} disabled={!!calc?.periodLength} onChange={(e) => setPeriod(Number(e.target.value))} aria-describedby="per-hint" />
            <span id="per-hint" className="hint">{calc?.periodLength ? "berekend uit je maanden" : "dagen (meestal 5)"}</span>
          </div>
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        <h2 className="display" style={{ fontSize: 24, lineHeight: 1.1 }}>Eten dat je liever mijdt</h2>
        <span style={{ fontSize: 14, lineHeight: 1.45, color: "var(--ink-2)" }}>Optioneel. Dit kun je later altijd aanpassen.</span>
      </div>
      <VoorkeurKiezer id="allergie" titel="Allergie of intolerantie" uitleg="Hier laat Juna het ingrediënt altijd weg. Controleer bij een ernstige allergie altijd zelf de verpakking." waarde={allergie} anderen={nietLekker} onChange={(ids) => saveVoorkeuren({ allergie: ids, nietLekker: nietLekker.filter((x) => !ids.includes(x)) })} />
      <VoorkeurKiezer id="nietlekker" titel="Dit vind ik niet lekker" uitleg="Een smaakkeuze. Juna laat dit weg uit jouw sapjes." waarde={nietLekker} anderen={allergie} onChange={(ids) => saveVoorkeuren({ allergie, nietLekker: ids })} />
      <VoorkeurTelling uitgesloten={[...allergie, ...nietLekker]} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <p role="alert" style={{ color: "var(--berry-d)", fontSize: 14, fontWeight: 700 }}>{error}</p>
        )}
        <button type="submit" form="cyclus" className="btn btn-dark btn-block" style={{ minHeight: 56, borderRadius: 18 }}>
          Toon mijn sap van deze week
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "0 4px" }}>
        <IconLock size={20} color="var(--violet-d)" />
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Je gegevens blijven alleen op dit toestel opgeslagen. Er wordt niets naar een server gestuurd.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2 className="display" style={{ fontSize: 20, lineHeight: 1.1 }}>Je gegevens bewaren</h2>
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Alles staat alleen op dit toestel. Bewaar een bestand, dan raak je niets kwijt bij een nieuwe telefoon.
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-light" style={{ minHeight: 44, borderRadius: 14, fontSize: 14 }} onClick={downloadBackup}>
            Bewaar mijn gegevens
          </button>
          <label className="btn btn-light" style={{ minHeight: 44, borderRadius: 14, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
            Zet mijn gegevens terug
            <input
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                const ok = herstelBackup(await f.text());
                setBackupMsg(ok ? "Teruggezet." : "Dit bestand hoort niet bij Juna.");
                if (ok) setTimeout(() => window.location.assign("/app"), 700);
              }}
            />
          </label>
        </div>
        {backupMsg ? <span role="status" style={{ fontSize: 13, color: "var(--ink-2)" }}>{backupMsg}</span> : null}
      </div>

      {cycle && (
        <button
          type="button"
          onClick={() => {
            clearCycle();
            clearVoorkeuren();
            wisAlleMijn();
            router.push("/app/welkom");
          }}
          style={{ background: "none", border: "none", color: "var(--berry-d)", fontWeight: 700, fontSize: 14, minHeight: 44, cursor: "pointer" }}
        >
          Wis mijn gegevens
        </button>
      )}
    </main>
  );
}

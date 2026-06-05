import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, ScanEye, Users, CheckCircle2, Pause } from "lucide-react";

export const Route = createFileRoute("/officer")({
  head: () => ({ meta: [{ title: "Officer console · FinSoko" }] }),
  component: OfficerConsole,
});

const queue = [
  { id: "L-1071", trader: "Joseph Mwangi", segment: "Boda boda", amount: 9500, score: 712, risk: 2.1, guard: true, flagged: false },
  { id: "L-1088", trader: "Amina Wanjiru", segment: "Market vendor", amount: 32000, score: 684, risk: 2.7, guard: true, flagged: false },
  { id: "L-1102", trader: "Esther Achieng", segment: "Smallholder farmer", amount: 45000, score: 591, risk: 3.4, guard: false, flagged: true },
  { id: "L-1110", trader: "Brian Otieno", segment: "Boda boda", amount: 12000, score: 628, risk: 1.9, guard: true, flagged: false },
];

const audits = [
  { ts: "2026-06-05 09:14", actor: "Officer Mary K.", action: "Approved L-1042", bias: false },
  { ts: "2026-06-05 09:21", actor: "AI Scout v0.1", action: "Flagged L-1102 — gender-region risk delta 4.2σ", bias: true },
  { ts: "2026-06-04 17:33", actor: "GUARD", action: "Blocked L-1095 — projected default 3.6% > 3.0%", bias: false },
  { ts: "2026-06-04 16:02", actor: "Officer James O.", action: "Declined L-1090 with notes", bias: false },
];

function OfficerConsole() {
  return (
    <div className="min-h-screen bg-savanna">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">PRIDE loop · Human review console</p>
            <h1 className="font-display text-3xl font-bold">Officer dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><ScanEye /> Run TRACK audit</Button>
            <Button variant="hero"><CheckCircle2 /> Approve batch</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <KPI icon={<Users />} label="Pending review" value="14" />
          <KPI icon={<AlertTriangle />} label="Bias flags (7d)" value="3" tone="warning" />
          <KPI icon={<ShieldCheck />} label="GUARD blocks (7d)" value="6" tone="success" />
          <KPI icon={<Pause />} label="PRIDE pause rate" value="22%" />
        </div>

        <h2 className="mt-12 font-display text-xl font-bold">Review queue</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Trader</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">RANK score</th>
                <th className="px-4 py-3">Default risk</th>
                <th className="px-4 py-3">GUARD</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q) => (
                <tr key={q.id} className={`border-t border-border ${q.flagged ? "bg-destructive/5" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
                  <td className="px-4 py-3">{q.trader}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.segment}</td>
                  <td className="px-4 py-3">KES {q.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{q.score}</td>
                  <td className={`px-4 py-3 ${q.risk > 3 ? "text-destructive font-medium" : ""}`}>{q.risk.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    {q.guard ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs text-success"><ShieldCheck className="h-3 w-3" /> pass</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs text-destructive"><AlertTriangle className="h-3 w-3" /> blocked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant={q.guard ? "default" : "outline"} disabled={!q.guard}>Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-xl font-bold">TRACK audit log</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {audits.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.actor} · {a.ts}</p>
                </div>
                {a.bias && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning-foreground">
                    <AlertTriangle className="h-3 w-3" /> bias flagged
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: "warning" | "success" }) {
  const ring = tone === "warning" ? "ring-warning/40" : tone === "success" ? "ring-success/40" : "ring-border";
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ring-1 ${ring}`}>
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs uppercase tracking-wide">{label}</span></div>
      <p className="mt-1 font-display text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}

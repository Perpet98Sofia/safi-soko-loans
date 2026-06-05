import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Trader dashboard · FinSoko" }] }),
  component: TraderDashboard,
});

// Mock data — phase 2 will load via createServerFn + requireSupabaseAuth.
const loans = [
  { id: "L-1042", amount: 18000, purpose: "Restock vegetables for Kawangware market", status: "approved", risk: 1.4, when: "2026-05-30" },
  { id: "L-1071", amount: 9500, purpose: "Boda fuel + chain replacement", status: "under_review", risk: 2.1, when: "2026-06-02" },
  { id: "L-1088", amount: 32000, purpose: "Seed + fertilizer for short rains", status: "pending", risk: 2.7, when: "2026-06-04" },
];

const statusLabel: Record<string, { text: string; tone: string }> = {
  approved: { text: "Approved · Imeidhinishwa", tone: "bg-success/15 text-success" },
  under_review: { text: "Under human review · Inakaguliwa", tone: "bg-accent/30 text-foreground" },
  pending: { text: "Pending · Inasubiri", tone: "bg-muted text-muted-foreground" },
  rejected: { text: "Declined · Imekataliwa", tone: "bg-destructive/15 text-destructive" },
};

function TraderDashboard() {
  return (
    <div className="min-h-screen bg-savanna">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Karibu tena · Welcome back</p>
            <h1 className="font-display text-3xl font-bold">Amina Wanjiru</h1>
            <p className="mt-1 text-sm text-muted-foreground">Market vendor · Nairobi · Member since 2025</p>
          </div>
          <Link to="/apply"><Button variant="hero">New application <ArrowRight /></Button></Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <KPI label="Active credit (KES)" value="27,500" hint="2 active loans" />
          <KPI label="Repayment streak" value="14 wks" hint="On time" />
          <KPI label="Credit tier (RANK)" value="Scout → Guardian" hint="Calibrating" />
        </div>

        <h2 className="mt-12 font-display text-xl font-bold">My applications</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">GUARD risk</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{l.id}</td>
                  <td className="px-4 py-3">KES {l.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.purpose}</td>
                  <td className="px-4 py-3">
                    <span className={l.risk > 3 ? "text-destructive" : "text-success"}>{l.risk.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusLabel[l.status].tone}`}>
                      {l.status === "approved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {statusLabel[l.status].text}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <p className="text-muted-foreground">
            Your data is stored in African regions. You can request export or deletion at any time —
            every action is recorded to the TRACK audit log.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function KPI({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

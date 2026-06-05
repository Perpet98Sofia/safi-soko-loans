import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2, ShieldCheck, Radio, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Trader dashboard · FinSoko" }] }),
  component: TraderDashboard,
});

type LoanRow = {
  id: string;
  amount_kes: number;
  purpose: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

// Demo fallback used until the trader signs in (Phase 2 wires auth).
const demoLoans: LoanRow[] = [
  { id: "L-1042", amount_kes: 18000, purpose: "Restock vegetables for Kawangware market", status: "approved", created_at: "2026-05-30", updated_at: "2026-05-30" },
  { id: "L-1071", amount_kes: 9500, purpose: "Boda fuel + chain replacement", status: "under_review", created_at: "2026-06-02", updated_at: "2026-06-02" },
  { id: "L-1088", amount_kes: 32000, purpose: "Seed + fertilizer for short rains", status: "pending", created_at: "2026-06-04", updated_at: "2026-06-04" },
];

const statusLabel: Record<LoanRow["status"], { text: string; tone: string }> = {
  approved: { text: "Approved · Imeidhinishwa", tone: "bg-success/15 text-success" },
  under_review: { text: "Under human review · Inakaguliwa", tone: "bg-accent/30 text-foreground" },
  pending: { text: "Pending · Inasubiri", tone: "bg-muted text-muted-foreground" },
  rejected: { text: "Declined · Imekataliwa", tone: "bg-destructive/15 text-destructive" },
};

function TraderDashboard() {
  const [loans, setLoans] = useState<LoanRow[]>(demoLoans);
  const [traderId, setTraderId] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  const loadLoans = useCallback(async (tid: string) => {
    const { data, error } = await supabase
      .from("loan_applications")
      .select("id, amount_kes, purpose, status, created_at, updated_at")
      .eq("trader_id", tid)
      .order("created_at", { ascending: false });
    if (!error && data && data.length) setLoans(data as LoanRow[]);
  }, []);

  // Resolve current trader (if signed in) and load their real loans.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) return;
      const { data: trader } = await supabase
        .from("traders")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled || !trader?.id) return;
      setTraderId(trader.id);
      await loadLoans(trader.id);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadLoans]);

  // Realtime: subscribe to changes on this trader's loans.
  useEffect(() => {
    if (!traderId) return;
    const channel = supabase
      .channel(`loans:${traderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loan_applications",
          filter: `trader_id=eq.${traderId}`,
        },
        (payload) => {
          const next = payload.new as Partial<LoanRow> | null;
          const prev = payload.old as Partial<LoanRow> | null;
          if (payload.eventType === "UPDATE" && next?.status && prev?.status && next.status !== prev.status) {
            toast(`Loan ${String(next.id).slice(0, 6)}: ${statusLabel[next.status as LoanRow["status"]].text}`);
          } else if (payload.eventType === "INSERT") {
            toast("New application received");
          }
          loadLoans(traderId);
        },
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [traderId, loadLoans]);

  const activeTotal = loans
    .filter((l) => l.status === "approved" || l.status === "under_review")
    .reduce((sum, l) => sum + l.amount_kes, 0);

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
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                live ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}
              title={live ? "Realtime connected" : "Realtime offline"}
            >
              <Radio className={`h-3 w-3 ${live ? "animate-pulse" : ""}`} />
              {live ? "Live updates" : "Offline"}
            </span>
            <Link to="/apply">
              <Button variant="hero">
                New application <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <KPI label="Active credit (KES)" value={activeTotal.toLocaleString()} hint={`${loans.length} application${loans.length === 1 ? "" : "s"}`} />
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
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-t border-border transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{String(l.id).slice(0, 8)}</td>
                  <td className="px-4 py-3">KES {l.amount_kes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.purpose}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(l.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
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
            Status updates stream live from the officer console — every decision is recorded to the TRACK
            audit log and your data stays in African regions.
          </p>
        </div>

        <details className="mt-4 rounded-xl border border-border bg-card text-sm">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-medium text-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Developer / Regulator note: How RLS protects your live updates
          </summary>
          <div className="border-t border-border px-4 py-4 text-muted-foreground">
            <p className="mb-2">
              FinSoko uses <strong>Row-Level Security (RLS)</strong> on the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">loan_applications</code> table.
              When a trader opens this dashboard, the browser subscribes to a Supabase Realtime channel filtered by <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">trader_id</code>.
            </p>
            <p className="mb-2">
              The database enforces a strict policy: each trader can only read rows where their own <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">user_id</code> matches the authenticated session.
              Even if a malicious client tried to remove or alter the client-side filter, the server would still evaluate the RLS policy on every event and drop any loan update that does not belong to the signed-in trader.
            </p>
            <p>
              This means every realtime status change — from Pending → Under Review → Approved — is delivered only to the rightful borrower,
              satisfying East African data-sovereignty requirements and FinSoko’s TRACK audit guarantees.
            </p>
          </div>
        </details>
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

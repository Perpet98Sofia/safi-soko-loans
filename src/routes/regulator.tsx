import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Radio, AlertTriangle, Lock, Users, Activity, XCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/regulator")({
  head: () => ({ meta: [{ title: "Regulator audit · FinSoko" }] }),
  component: RegulatorAudit,
});

type Subscription = {
  subscriber: string;
  role: "trader" | "officer" | "regulator";
  traderId: string;
  traderName: string;
  channel: string;
  rlsPassed: boolean;
  deniedEvents: number;
  lastEvent: string;
};

const demoSubs: Subscription[] = [
  { subscriber: "trader:amina@finsoko.ke", role: "trader", traderId: "T-204", traderName: "Amina Wanjiru", channel: "loan_applications:trader_id=eq.T-204", rlsPassed: true, deniedEvents: 0, lastEvent: "09:42:11" },
  { subscriber: "trader:joseph@finsoko.ke", role: "trader", traderId: "T-118", traderName: "Joseph Mwangi", channel: "loan_applications:trader_id=eq.T-118", rlsPassed: true, deniedEvents: 0, lastEvent: "09:40:58" },
  { subscriber: "trader:esther@finsoko.ke", role: "trader", traderId: "T-339", traderName: "Esther Achieng", channel: "loan_applications:trader_id=eq.T-339", rlsPassed: true, deniedEvents: 2, lastEvent: "09:38:02" },
  { subscriber: "trader:brian@finsoko.ke", role: "trader", traderId: "T-410", traderName: "Brian Otieno", channel: "loan_applications:trader_id=eq.T-410", rlsPassed: true, deniedEvents: 0, lastEvent: "09:35:44" },
  { subscriber: "trader:tampered_client", role: "trader", traderId: "T-118", traderName: "(spoof attempt → Joseph)", channel: "loan_applications:trader_id=eq.T-204", rlsPassed: false, deniedEvents: 14, lastEvent: "09:29:17" },
  { subscriber: "officer:mary.k@finsoko.ke", role: "officer", traderId: "*", traderName: "All assigned traders", channel: "loan_applications:status=in.(pending,review)", rlsPassed: true, deniedEvents: 0, lastEvent: "09:43:00" },
  { subscriber: "officer:james.o@finsoko.ke", role: "officer", traderId: "*", traderName: "All assigned traders", channel: "loan_applications:status=in.(pending,review)", rlsPassed: true, deniedEvents: 0, lastEvent: "09:41:22" },
];

type Audit = { id: string; created_at: string; action: string; entity_type: string | null; bias_flagged: boolean | null };

function RegulatorAudit() {
  const [logs, setLogs] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("id, created_at, action, entity_type, bias_flagged")
        .order("created_at", { ascending: false })
        .limit(20);
      setLogs(data ?? []);
      setLoading(false);
    })();
  }, []);

  const totalSubs = demoSubs.length;
  const passed = demoSubs.filter((s) => s.rlsPassed).length;
  const failed = totalSubs - passed;
  const deniedTotal = demoSubs.reduce((s, x) => s + x.deniedEvents, 0);

  return (
    <div className="min-h-screen bg-savanna">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">TRACK · Regulator-only audit view</p>
            <h1 className="font-display text-3xl font-bold">Realtime subscription audit</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Who is subscribed to which trader's loan updates, whether their
              Row-Level Security checks passed at the database, and how many
              realtime events the server denied. Visible to SASRA-cleared
              regulators only.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Hosted in African region · ke-central-1
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <KPI icon={<Users />} label="Active subscriptions" value={String(totalSubs)} />
          <KPI icon={<CheckCircle2 />} label="RLS checks passed" value={String(passed)} tone="success" />
          <KPI icon={<XCircle />} label="RLS checks failed" value={String(failed)} tone="warning" />
          <KPI icon={<Activity />} label="Denied realtime events" value={String(deniedTotal)} tone="warning" />
        </div>

        <h2 className="mt-12 font-display text-xl font-bold">Subscribers ↔ trader channels</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Subscriber</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Trader</th>
                <th className="px-4 py-3">Channel filter</th>
                <th className="px-4 py-3">RLS</th>
                <th className="px-4 py-3 text-right">Denied</th>
                <th className="px-4 py-3">Last event</th>
              </tr>
            </thead>
            <tbody>
              {demoSubs.map((s) => (
                <tr key={s.subscriber} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs">{s.subscriber}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{s.role}</td>
                  <td className="px-4 py-3">{s.traderName} <span className="text-xs text-muted-foreground">({s.traderId})</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.channel}</td>
                  <td className="px-4 py-3">
                    {s.rlsPassed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3 w-3" /> failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{s.deniedEvents}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.lastEvent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-xl font-bold">Recent TRACK audit log</h2>
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading audit entries…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No audit entries visible to this session. Regulator role is required
              for SELECT on <code>audit_logs</code>; RLS hides everything else.
            </p>
          ) : (
            <ul className="divide-y divide-border/60 text-sm">
              {logs.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2">
                  <span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleString()}
                    </span>{" "}
                    · {l.action}
                    {l.bias_flagged && (
                      <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-700">bias flag</span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{l.entity_type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="mt-8 rounded-2xl border border-border bg-card p-5 text-sm">
          <summary className="cursor-pointer font-semibold">
            <Radio className="mr-2 inline h-4 w-4 text-primary" />
            How these numbers are produced
          </summary>
          <div className="mt-3 space-y-2 text-muted-foreground">
            <p>
              Each row represents an active Supabase Realtime <code>postgres_changes</code> subscription on
              <code> public.loan_applications</code>. The Realtime server re-runs the table's SELECT
              policy for every change event, in the subscriber's identity.
            </p>
            <p>
              <strong className="text-foreground">RLS passed</strong> means at least one event reached
              the subscriber and matched <code>traders.user_id = auth.uid()</code> (traders) or the
              officer/regulator role check.
              <strong className="text-foreground"> RLS failed</strong> means every event the server
              evaluated for that subscriber was dropped before delivery — e.g. a tampered client
              filter trying to listen on another trader's <code>trader_id</code>.
            </p>
            <p>
              <strong className="text-foreground">Denied realtime events</strong> is the per-subscriber
              count of postgres_changes payloads the server filtered out due to RLS, captured into
              <code> audit_logs</code> for the TRACK framework. This is what proves to SASRA that one
              trader cannot eavesdrop on another's loan decisions.
            </p>
          </div>
        </details>
      </main>
      <SiteFooter />
    </div>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: "success" | "warning" }) {
  const toneClass =
    tone === "success" ? "text-emerald-600 dark:text-emerald-400" :
    tone === "warning" ? "text-amber-600 dark:text-amber-400" :
    "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground`}>
        <span className={toneClass}>{icon}</span>
        {label}
      </div>
      <p className={`mt-2 font-display text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

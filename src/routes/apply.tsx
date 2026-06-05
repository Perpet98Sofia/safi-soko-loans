import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { dict, t, type Lang } from "@/lib/i18n";
import { CheckCircle2, ShieldCheck, Languages } from "lucide-react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a FinSoko loan · Omba mkopo" },
      {
        name: "description",
        content:
          "Apply for ethical working-capital credit in Swahili or English. Reviewed by a human officer.",
      },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tt = (k: keyof typeof dict.en) => t(lang, k);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError(tt("must_consent"));
      return;
    }
    // TODO Phase 2: createServerFn → insert into traders + loan_applications + audit log
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-savanna">
        <SiteNav />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <h1 className="mt-4 font-display text-3xl font-bold">{tt("submitted")}</h1>
          <p className="mt-3 text-muted-foreground">
            Reference logged to TRACK audit trail · PRIDE review pending.
          </p>
          <Link to="/dashboard" className="mt-6 inline-block">
            <Button>{tt("dashboard")} →</Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-savanna">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">{tt("apply_title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tt("apply_sub")}</p>
          </div>
          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">{tt("lang_label")}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </label>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Field label={tt("full_name")} name="full_name" required />
          <Field label={tt("phone")} name="phone" type="tel" placeholder="+254 7XX XXX XXX" required />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label={tt("occupation")} name="occupation" required
              options={[
                ["market_vendor", tt("occ_market_vendor")],
                ["boda_boda", tt("occ_boda_boda")],
                ["smallholder_farmer", tt("occ_smallholder_farmer")],
                ["other", tt("occ_other")],
              ]}
            />
            <Field label={tt("region")} name="region" placeholder="Nairobi" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={tt("amount")} name="amount" type="number" min={500} required />
            <Field label={tt("period")} name="period" type="number" defaultValue={6} min={1} max={24} required />
          </div>
          <Field label={tt("purpose")} name="purpose" as="textarea" required />

          <div className="rounded-xl border border-accent/50 bg-accent/15 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{tt("consent_title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tt("consent_body")}</p>
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-[var(--color-primary)]"
                  />
                  <span>I consent · Ninakubali</span>
                </label>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" variant="hero" size="lg" className="w-full">
            {tt("submit")}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label, name, type = "text", as, ...rest
}: {
  label: string; name: string; type?: string; as?: "textarea";
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls =
    "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} rows={3} className={cls} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input name={name} type={type} className={cls} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}

function SelectField({
  label, name, options, ...rest
}: { label: string; name: string; options: [string, string][] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        name={name}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        {...rest}
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

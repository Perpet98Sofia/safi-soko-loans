import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sprout, Bike, Store, Globe2, ScanEye } from "lucide-react";
import heroImg from "@/assets/finsoko-hero.jpg";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-savanna">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Nairobi • Kampala • Dar • Kigali
            </span>
            <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Fair credit for the people who keep East Africa moving.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              FinSoko extends ethical, AI-assisted working capital to market vendors,
              boda boda riders, and smallholder farmers — with human review on every
              decision and data that stays on African soil.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/apply">
                <Button variant="hero" size="lg">
                  Omba mkopo · Apply for a loan <ArrowRight />
                </Button>
              </Link>
              <Link to="/officer">
                <Button variant="outline" size="lg">Officer console</Button>
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              <Stat k="+37%" v="Approvals for informal traders" />
              <Stat k="85%+" v="Member data in Africa" />
              <Stat k="<3%" v="GUARD default ceiling" />
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-sunset opacity-30 blur-2xl" />
            <img
              src={heroImg}
              alt="Smiling Nairobi market vendor at golden hour"
              width={1600}
              height={1100}
              className="relative h-[520px] w-full rounded-3xl object-cover shadow-warm"
            />
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl font-bold">Built for the informal economy</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          One platform, three livelihoods. Bilingual Swahili + English flows, USSD-friendly forms,
          and credit logic trained on East African trading data.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Persona icon={<Store />} title="Market vendors" sw="Wafanyabiashara wa soko" body="Stock-up loans timed to market days, repaid from daily cashflow." />
          <Persona icon={<Bike />} title="Boda boda riders" sw="Madereva wa boda" body="Fuel and maintenance credit calibrated to ride frequency." />
          <Persona icon={<Sprout />} title="Smallholder farmers" sw="Wakulima wadogo" body="Seasonal input loans aligned with planting and harvest cycles." />
        </div>
      </section>

      {/* GOVERNANCE */}
      <section id="governance" className="bg-card/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-3xl font-bold">PRIDE + GUARD by default</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Every loan decision passes through a layered governance loop —
                AI scout, human guardian, regulator-ready audit.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Pillar icon={<ScanEye />} title="TRACK audits" body="Every flagged bias incident is logged and reviewable." />
              <Pillar icon={<ShieldCheck />} title="GUARD rails" body="Approvals halt when projected default risk exceeds 3%." />
              <Pillar icon={<Globe2 />} title="Data sovereignty" body="85%+ of member data governed within African regions." />
              <Pillar icon={<ShieldCheck />} title="PRIDE pause" body="Human officer must confirm every approval over threshold." />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-3xl font-black text-primary">{k}</dt>
      <dd className="mt-1 text-xs text-muted-foreground">{v}</dd>
    </div>
  );
}

function Persona({ icon, title, sw, body }: { icon: React.ReactNode; title: string; sw: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-warm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/40 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{sw}</p>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="font-display text-base font-bold text-foreground">{title}</span></div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

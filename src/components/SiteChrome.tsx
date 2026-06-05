import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sunset text-primary-foreground font-display font-black">
            F
          </span>
          <span className="font-display text-xl font-bold tracking-tight">FinSoko</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/dashboard" className="hover:text-foreground">Trader</Link>
          <Link to="/apply" className="hover:text-foreground">Apply</Link>
          <Link to="/officer" className="hover:text-foreground">Officer</Link>
          <a href="#governance" className="hover:text-foreground">Governance</a>
        </nav>
        <Link
          to="/apply"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Apply for credit
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">FinSoko</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Nairobi-based ethical credit infrastructure for East Africa's informal economy.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Governance</p>
          <ul className="space-y-1">
            <li>SASRA-aligned policy</li>
            <li>African data sovereignty (85%+)</li>
            <li>PRIDE human-in-the-loop review</li>
            <li>GUARD risk rails (&lt;3% default)</li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Frameworks</p>
          <ul className="space-y-1">
            <li>ETHOS — ethical baseline</li>
            <li>TRACK — bias audits</li>
            <li>OASIS — operator safety</li>
            <li>HORIZON — long-horizon planning</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FinSoko. Hosted in African regions.
      </div>
    </footer>
  );
}

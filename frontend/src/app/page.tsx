import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Znajdź idealnego psa rasowego
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Platforma dla hodowców i właścicieli psów rasowych w Polsce.
          Przeglądaj profile psów, znajdź hodowcę i nawiąż kontakt.
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/psy">Przeglądaj psy</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/hodowcy">Znajdź hodowcę</Link>
        </Button>
      </div>
    </div>
  );
}

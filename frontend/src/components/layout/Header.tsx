"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        pathname.startsWith(href)
          ? "text-foreground"
          : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          RodoWod
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {/* Main navigation */}
        <nav className="flex items-center gap-5">
          {navLink("/psy", "Psy")}
          {navLink("/hodowcy", "Hodowcy")}
        </nav>

        {/* Auth section — pushed to the right */}
        <div className="ml-auto flex items-center gap-2">
          {isLoading ? null : user ? (
            <>
              <Link
                href="/moj-profil"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {user.first_name} {user.last_name}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

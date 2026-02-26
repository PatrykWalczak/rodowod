"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useDog, useDeleteDog } from "@/hooks/useDogs";

const SEX_LABEL: Record<string, string> = {
  male: "Pies",
  female: "Suka",
};

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function DogProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: dog, isLoading, isError } = useDog(id);
  const { user } = useAuth();
  const router = useRouter();
  const deleteDog = useDeleteDog();

  const isOwner = !!user && dog?.owner_id === user.id;

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten profil?")) return;
    await deleteDog.mutateAsync(id);
    router.push("/psy");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (isError || !dog) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium">Nie znaleziono psa</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/psy">Wróć do listy</Link>
        </Button>
      </div>
    );
  }

  const born = new Date(dog.date_of_birth).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* Photo */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {dog.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dog.photo_url} alt={dog.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl text-muted-foreground">
            🐾
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{dog.name}</h1>
          {dog.call_name && (
            <p className="text-muted-foreground">&bdquo;{dog.call_name}&rdquo;</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">{SEX_LABEL[dog.sex]}</Badge>
            <Badge variant="outline">{dog.breed.name_pl}</Badge>
            {dog.is_available_for_breeding && (
              <Badge variant="secondary">Dostępny do rozrodu</Badge>
            )}
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/psy/${dog.id}/edytuj`}>Edytuj</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteDog.isPending}
            >
              Usuń
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Details */}
      <div className="space-y-2">
        <DetailRow label="Data urodzenia" value={born} />
        <DetailRow label="Kolor" value={dog.color} />
        <DetailRow label="Nr rejestracyjny" value={dog.registration_number} />
        <DetailRow label="Nr mikrochipa" value={dog.microchip_number} />
        <DetailRow label="Tytuły" value={dog.titles} />
      </div>

      {/* Description */}
      {dog.description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="font-semibold">Opis</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{dog.description}</p>
          </div>
        </>
      )}

      {/* Health tests */}
      {dog.health_tests && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="font-semibold">Badania zdrowotne</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{dog.health_tests}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Owner link */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Właściciel:</span>
        <Link
          href={`/hodowcy/${dog.owner_id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          Zobacz profil właściciela →
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DogResponse } from "@/lib/types";

interface DogCardProps {
  dog: DogResponse;
}

const SEX_LABEL: Record<string, string> = {
  male: "Pies",
  female: "Suka",
};

function calcAge(dateOfBirth: string): string {
  const born = new Date(dateOfBirth);
  const now = new Date();
  const months =
    (now.getFullYear() - born.getFullYear()) * 12 +
    (now.getMonth() - born.getMonth());
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"}`;
}

export default function DogCard({ dog }: DogCardProps) {
  return (
    <Link href={`/psy/${dog.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        {/* Photo */}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {dog.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dog.photo_url}
              alt={dog.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
              🐾
            </div>
          )}
        </div>

        <CardContent className="p-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold leading-tight">{dog.name}</p>
            {dog.is_available_for_breeding && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Rozród
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{dog.breed.name_pl}</p>

          <p className="text-xs text-muted-foreground">
            {SEX_LABEL[dog.sex]} · {calcAge(dog.date_of_birth)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

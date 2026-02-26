"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DogCard from "@/components/dogs/DogCard";
import { useUser, useUserDogs } from "@/hooks/useUsers";

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export default function HodowcaProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useUser(id);
  const { data: dogs } = useUserDogs(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium">Nie znaleziono użytkownika</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/hodowcy">Wróć do listy</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.first_name} />
          <AvatarFallback className="text-2xl">
            {initials(user.first_name, user.last_name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          {user.kennel_name && (
            <p className="text-muted-foreground">{user.kennel_name}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {user.is_breeder && <Badge variant="secondary">Hodowca</Badge>}
            {user.city && (
              <Badge variant="outline">
                {user.city}
                {user.voivodeship && `, ${user.voivodeship}`}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <>
          <Separator />
          <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        </>
      )}

      {/* Contact */}
      {user.phone && (
        <>
          <Separator />
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground">Telefon:</span>
            <span>{user.phone}</span>
          </div>
        </>
      )}

      {/* Dogs */}
      {dogs && dogs.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h2 className="font-semibold">
              Psy ({dogs.length})
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

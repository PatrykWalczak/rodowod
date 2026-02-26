import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/lib/types";

interface UserCardProps {
  user: UserResponse;
}

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/hodowcy/${user.id}`} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.first_name} />
            <AvatarFallback className="text-lg">
              {initials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-0.5">
            <p className="font-semibold leading-tight">
              {user.first_name} {user.last_name}
            </p>
            {user.kennel_name && (
              <p className="text-sm text-muted-foreground">{user.kennel_name}</p>
            )}
            {user.city && (
              <p className="text-xs text-muted-foreground">{user.city}</p>
            )}
          </div>

          {user.is_breeder && (
            <Badge variant="secondary" className="text-xs">
              Hodowca
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

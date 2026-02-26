"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DogCard from "@/components/dogs/DogCard";
import { useAuth } from "@/hooks/useAuth";
import { useUserDogs, useUpdateMe } from "@/hooks/useUsers";

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  first_name: z.string().min(1, "Imię jest wymagane"),
  last_name: z.string().min(1, "Nazwisko jest wymagane"),
  phone: z.string().optional(),
  city: z.string().optional(),
  voivodeship: z.string().optional(),
  kennel_name: z.string().optional(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MojProfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const updateMe = useUpdateMe();
  const { data: dogs } = useUserDogs(user?.id ?? "");

  // Client-side route protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/logowanie");
    }
  }, [isLoading, user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      city: "",
      voivodeship: "",
      kennel_name: "",
      bio: "",
    },
  });

  // Populate form once user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone ?? "",
        city: user.city ?? "",
        voivodeship: user.voivodeship ?? "",
        kennel_name: user.kennel_name ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    await updateMe.mutateAsync(values);
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback className="text-xl">
            {initials(user.first_name, user.last_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      {/* Edit profile form */}
      <div className="space-y-4">
        <h2 className="font-semibold">Edytuj profil</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl><Input placeholder="+48 123 456 789" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miasto</FormLabel>
                    <FormControl><Input placeholder="Warszawa" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voivodeship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Województwo</FormLabel>
                    <FormControl><Input placeholder="mazowieckie" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="kennel_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa hodowli</FormLabel>
                  <FormControl><Input placeholder="Hodowla XYZ" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>O mnie</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Kilka słów o sobie…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Zapisywanie…" : "Zapisz zmiany"}
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* My dogs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Moje psy</h2>
          <Button size="sm" asChild>
            <Link href="/psy/dodaj">+ Dodaj psa</Link>
          </Button>
        </div>

        {dogs && dogs.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze żadnych psów.{" "}
            <Link href="/psy/dodaj" className="underline hover:text-foreground">
              Dodaj pierwszego
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

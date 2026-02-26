"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useBreeds } from "@/hooks/useBreeds";
import { useCreateDog } from "@/hooks/useDogs";
import { ApiError } from "@/lib/api";

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  sex: z.enum(["male", "female"]),
  date_of_birth: z.string().min(1, "Data urodzenia jest wymagana"),
  breed_id: z.number().min(1, "Wybierz rasę"),
  color: z.string().optional(),
  description: z.string().optional(),
  health_tests: z.string().optional(),
  titles: z.string().optional(),
  registration_number: z.string().optional(),
  is_available_for_breeding: z.boolean().optional(),
  photo_url: z.string().url("Podaj prawidłowy URL").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DodajPsaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const createDog = useCreateDog();
  const { data: breedsData } = useBreeds();
  const breeds = breedsData?.items ?? [];
  const [serverError, setServerError] = useState<string | null>(null);

  // Client-side route protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/logowanie");
    }
  }, [isLoading, user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      breed_id: 0,
      color: "",
      description: "",
      health_tests: "",
      titles: "",
      registration_number: "",
      photo_url: "",
      is_available_for_breeding: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const dog = await createDog.mutateAsync({
        ...values,
        photo_url: values.photo_url || undefined,
        color: values.color || undefined,
        description: values.description || undefined,
        health_tests: values.health_tests || undefined,
        titles: values.titles || undefined,
        registration_number: values.registration_number || undefined,
      });
      router.push(`/psy/${dog.id}`);
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : "Wystąpił błąd. Spróbuj ponownie."
      );
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Dodaj psa</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię psa *</FormLabel>
                <FormControl><Input placeholder="np. Burek" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sex + Date of birth */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Płeć *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Wybierz" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Pies</SelectItem>
                      <SelectItem value="female">Suka</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data urodzenia *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Breed */}
          <FormField
            control={form.control}
            name="breed_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rasa *</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Wybierz rasę" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {breeds.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name_pl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color + Registration */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kolor sierści</FormLabel>
                  <FormControl><Input placeholder="np. czarny" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nr rejestracyjny</FormLabel>
                  <FormControl><Input placeholder="np. PKR.III-12345" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Kilka słów o psie…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Photo URL */}
          <FormField
            control={form.control}
            name="photo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/zdjecie.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Available for breeding */}
          <FormField
            control={form.control}
            name="is_available_for_breeding"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel className="font-normal">Dostępny do rozrodu</FormLabel>
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Zapisywanie…" : "Dodaj psa"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Anuluj
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

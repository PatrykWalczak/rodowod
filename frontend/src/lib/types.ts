// ─── Enums ───────────────────────────────────────────────────────────────────

export type DogSex = "male" | "female";

export type SizeCategory = "mini" | "small" | "medium" | "large" | "giant";

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  city: string | null;
  voivodeship: string | null;
  bio: string | null;
  kennel_name: string | null;
  is_breeder: boolean;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  voivodeship?: string;
  bio?: string;
  kennel_name?: string;
  is_breeder?: boolean;
  avatar_url?: string;
}

export type UserListResponse = PaginatedResponse<UserResponse>;

// ─── Breed ────────────────────────────────────────────────────────────────────

export interface BreedInfo {
  id: number;
  name_pl: string;
  name_en: string | null;
  fci_group: number | null;
}

export interface BreedResponse {
  id: number;
  name_pl: string;
  name_en: string | null;
  fci_number: number | null;
  fci_group: number | null;
  fci_section: number | null;
  size_category: SizeCategory | null;
  description_pl: string | null;
  image_url: string | null;
}

export interface FciGroupResponse {
  fci_group: number;
  breed_count: number;
}

export type BreedListResponse = PaginatedResponse<BreedResponse>;

// ─── Dog ──────────────────────────────────────────────────────────────────────

export interface DogResponse {
  id: string;
  name: string;
  call_name: string | null;
  sex: DogSex;
  date_of_birth: string;
  color: string | null;
  breed: BreedInfo;
  owner_id: string;
  registration_number: string | null;
  microchip_number: string | null;
  sire_id: string | null;
  dam_id: string | null;
  health_tests: string | null;
  titles: string | null;
  description: string | null;
  is_available_for_breeding: boolean | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DogCreate {
  name: string;
  call_name?: string;
  sex: DogSex;
  date_of_birth: string;
  breed_id: number;
  color?: string;
  registration_number?: string;
  microchip_number?: string;
  sire_id?: string;
  dam_id?: string;
  health_tests?: string;
  titles?: string;
  description?: string;
  is_available_for_breeding?: boolean;
  photo_url?: string;
}

export interface DogUpdate {
  name?: string;
  call_name?: string;
  color?: string;
  registration_number?: string;
  microchip_number?: string;
  sire_id?: string;
  dam_id?: string;
  health_tests?: string;
  titles?: string;
  description?: string;
  is_available_for_breeding?: boolean;
  photo_url?: string;
}

export type DogListResponse = PaginatedResponse<DogResponse>;

export interface PedigreeNode {
  id: string;
  name: string;
  sex: DogSex;
  date_of_birth: string;
  breed: BreedInfo;
  registration_number: string | null;
  photo_url: string | null;
  sire: PedigreeNode | null;
  dam: PedigreeNode | null;
}

// ─── Search filters ───────────────────────────────────────────────────────────

export interface DogFilters {
  breed_id?: number;
  sex?: DogSex;
  is_available_for_breeding?: boolean;
  name?: string;
  voivodeship?: string;
  city?: string;
  size_category?: SizeCategory;
  fci_group?: number;
  sort_by?: "newest" | "name";
  page?: number;
  limit?: number;
}

export interface UserFilters {
  q?: string;
  is_breeder?: boolean;
  city?: string;
  voivodeship?: string;
  page?: number;
  limit?: number;
}

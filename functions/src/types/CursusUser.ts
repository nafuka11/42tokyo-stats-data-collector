export type CursusUser = {
  grade: string | null;
  level: number;
  skills: Skill[];
  blackholed_at: string | null;
  id: number;
  begin_at: string;
  end_at: string | null;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  cursus: Cursus;
  launcher: null;
};

export type User = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  image_url: string | null;
  new_image_url: string | null;
  "staff?": boolean;
  correction_point: number;
  pool_month: string | null;
  pool_year: number | null;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumni: boolean;
  "is_launched?": boolean;
};

export const PrivateUserProperties = [
  "email",
  "login",
  "first_name",
  "last_name",
  "usual_full_name",
  "usual_first_name",
  "url",
  "phone",
  "displayname",
  "image_url",
  "new_image_url",
  "location",
] as const;

export type SanitizedUser = Omit<User, typeof PrivateUserProperties[number]>;

type Cursus = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
};

type Skill = {
  id: number;
  name: string;
  level: number;
};

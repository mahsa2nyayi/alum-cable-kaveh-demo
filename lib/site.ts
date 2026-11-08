/**
 * Single source of truth for company/contact details.
 * Override any value with the NEXT_PUBLIC_* variables in `.env`
 * (handy for a public demo that should not show real contact data).
 */
const env = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);

export const SITE = {
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "https://alumcablekaveh.com").replace(/\/+$/, ""),
  nameFa: "آلوم کابل کاوه",
  nameEn: "Alum Cable Kaveh",
  phones: [
    env(process.env.NEXT_PUBLIC_PHONE_1, "+98 21 4022 8249"),
    env(process.env.NEXT_PUBLIC_PHONE_2, "+98 21 4022 8832"),
  ],
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "info@alumcablekaveh.com"),
  /** Empty string => the icon is not rendered. */
  social: {
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL, ""),
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL, ""),
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL, ""),
  },
} as const;

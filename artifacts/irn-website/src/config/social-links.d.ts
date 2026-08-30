export type SocialPlatform = "facebook" | "instagram";

export interface SocialLink {
  readonly id: SocialPlatform;
  readonly label: string;
  readonly url: string;
}

export const SOCIAL_LINKS: readonly SocialLink[];
export const SOCIAL_PROFILE_URLS: readonly string[];

export const SOCIAL_LINKS = Object.freeze([
  Object.freeze({
    id: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/share/1P55ZZZ7dE/?mibextid=wwXIfr",
  }),
  Object.freeze({
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/insight_recovery_network?igsh=MWZyZXZ2c2VvdGVsOA%3D%3D&utm_source=qr",
  }),
]);

export const SOCIAL_PROFILE_URLS = Object.freeze(
  SOCIAL_LINKS.map(({ url }) => url),
);

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
const SITE_NAME = "Insight Recovery Network";

interface SEOProps {
  title: string;
  fullTitle?: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
  author?: string;
  section?: string;
}

export function SEO({
  title,
  fullTitle: fullTitleOverride,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogImageAlt = SITE_NAME,
  noIndex = false,
  ogType = "website",
  datePublished,
  dateModified,
  author,
  section,
}: SEOProps) {
  const fullTitle = fullTitleOverride ?? `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />

      {ogType === "article" && datePublished && (
        <meta property="article:published_time" content={datePublished} />
      )}
      {ogType === "article" && dateModified && (
        <meta property="article:modified_time" content={dateModified} />
      )}
      {ogType === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === "article" && section && (
        <meta property="article:section" content={section} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}

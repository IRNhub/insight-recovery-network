const ASSESSMENT_JOURNEY_KEY = "irn_assessment_journey";
const PRIVACY_RELOAD_KEY = "irn_assessment_privacy_reload";

export function isAssessmentBasePath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/assessments" ||
    path.startsWith("/assessments/") ||
    path === "/assessment/alcohol-detox" ||
    path === "/assessment-results" ||
    path.startsWith("/assessment-results/");
}

export function isAssessmentSensitiveJourney(
  pathname: string,
  assessmentLinkedHelp = false,
): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return isAssessmentBasePath(path) || (assessmentLinkedHelp && path === "/get-help");
}

function sessionFlag(): boolean {
  try {
    return window.sessionStorage.getItem(ASSESSMENT_JOURNEY_KEY) === "1";
  } catch {
    return false;
  }
}

export function currentPathIsAssessmentSensitive(): boolean {
  return typeof window !== "undefined" &&
    isAssessmentSensitiveJourney(window.location.pathname, sessionFlag());
}

export function markAssessmentLinkedHelpJourney(): void {
  try {
    window.sessionStorage.setItem(ASSESSMENT_JOURNEY_KEY, "1");
  } catch {
    // The path remains protected when session storage is unavailable.
  }
}

export function markAssessmentEntryIfNeeded(pathname: string): void {
  if (!isAssessmentBasePath(pathname)) return;
  markAssessmentLinkedHelpJourney();
}

function thirdPartyTrackerRuntimePresent(): boolean {
  return Boolean(
    document.querySelector('script[data-irn-gtm],script[data-irn-meta],script[data-irn-preferred-sources],script[src*="googletagmanager.com"],script[src*="connect.facebook.net"],script[src*="news.google.com/swg/js/v1/publisher.js"]') ||
    window.dataLayer ||
    window.fbq,
  );
}

/**
 * A hard reload is required when entering the sensitive journey from an
 * already-tracked SPA page. Removing script tags cannot undo listeners or
 * timers installed by previously executed third-party code.
 */
export function enforceAssessmentTrackingBoundary(pathname: string): boolean {
  markAssessmentEntryIfNeeded(pathname);
  if (!isAssessmentSensitiveJourney(pathname, sessionFlag())) return false;
  if (!thirdPartyTrackerRuntimePresent()) return false;

  const reloadIdentity = `${window.location.pathname}${window.location.search}`;
  try {
    if (window.sessionStorage.getItem(PRIVACY_RELOAD_KEY) === reloadIdentity) {
      window.sessionStorage.removeItem(PRIVACY_RELOAD_KEY);
      return false;
    }
    window.sessionStorage.setItem(PRIVACY_RELOAD_KEY, reloadIdentity);
  } catch {
    // Continue with a reload. The route-level load guards still prevent new
    // trackers if session storage cannot be used.
  }
  window.location.replace(window.location.href);
  return true;
}

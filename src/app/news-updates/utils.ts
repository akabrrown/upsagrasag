/* Shared helpers for the News & Updates section */

export const DEFAULT_AUTHOR = "GRASAG-UPSA Communications";

/**
 * Maps raw database category values to friendly, human-facing labels.
 * Fall back to the raw value (capitalised) for anything unmapped.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  news: "Campus News",
  articles: "Student Stories",
  announcements: "Announcements",
  press: "Press Releases",
  "grasag-updates": "GRASAG Updates",
  "events-recaps": "Events Recaps",
  "student-stories": "Student Stories",
  "campus news": "Campus News",
  "student stories": "Student Stories",
};

export const PREFERRED_CATEGORIES = [
  "Announcements",
  "Campus News",
  "GRASAG Updates",
  "Events Recaps",
  "Student Stories",
  "Press Releases",
];

export function categoryLabel(category?: string | null): string {
  if (!category) return "News";
  const key = category.toLowerCase();
  return CATEGORY_LABELS[key] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

/** Strip HTML tags and normalise whitespace from article content. */
export function stripHtml(content?: string | null): string {
  return (content || "")
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a plain-text excerpt of ~first sentences. */
export function buildExcerpt(content?: string | null, maxLength = 180): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Estimate reading time from content length (~200 words per minute). */
export function readingTime(content?: string | null): number {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function publishedDate(item: { published_at?: string | null; created_at?: string | null }): string {
  return new Date(item.published_at ?? item.created_at ?? "").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function publishedDateLong(item: { published_at?: string | null; created_at?: string | null }): string {
  return new Date(item.published_at ?? item.created_at ?? "").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getDateValue(item: { published_at?: string | null; created_at?: string | null }): number {
  const d = new Date(item.published_at ?? item.created_at ?? "");
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

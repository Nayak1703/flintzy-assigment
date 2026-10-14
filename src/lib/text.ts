const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null

/**
 * Counts user-perceived characters (grapheme clusters), so an emoji like 👩‍👩‍👧
 * counts as one character instead of 8 UTF-16 code units.
 */
export function countCharacters(text: string): number {
  if (!segmenter) return Array.from(text).length
  return Array.from(segmenter.segment(text)).length
}

/** Splits text at a grapheme limit, returning [within limit, overflow]. */
export function splitAtLimit(text: string, limit: number): [string, string] {
  const parts = segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : Array.from(text)
  if (parts.length <= limit) return [text, ""]
  return [parts.slice(0, limit).join(""), parts.slice(limit).join("")]
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

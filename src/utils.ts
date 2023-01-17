/**
 * Remove all non-alphanumeric characters.
 * @param string String to be normalized
 * @returns {string} Normalized string
 */
export function normalize(string: string): string {
  try {
    return string.replace(/\n/g, "").trim();
  } catch (error) {
    if (string === undefined) {
      return "/undefined";
    }
    throw error;
  }
}
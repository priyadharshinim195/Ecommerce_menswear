/** Builds ordered frame URLs from a config object. Frame order is preserved. */
export function buildFrameUrls({ basePath, pattern, count, padding = 3, startIndex = 1 }) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(startIndex + i).padStart(padding, '0');
    return basePath + pattern.replace('{index}', n);
  });
}

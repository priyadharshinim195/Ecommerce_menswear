/**
 * Central site configuration.
 *
 * HERO FRAMES: the hero reads its frame sequence from these settings.
 * To swap in final frames without touching code:
 *   1. Copy the frames into public/frames/hero/
 *   2. Set `pattern` to match their filenames, `{index}` is the frame number
 *   3. Set `count` to the number of frames (259 or 269 are both supported)
 *   Example: pattern 'ezgif-frame-{index}.jpg', padding 3, count 259
 */
export const site = {
  brandName: 'MAISON NOIR',
  currency: 'USD',
  hero: {
    basePath: '/frames/hero/',
    pattern: 'frame-{index}.jpg',
    count: 259,
    padding: 3,
    startIndex: 1,
  },
};

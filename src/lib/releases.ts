import { GITHUB_REPO } from '../config';

export interface LatestRelease {
  version: string | null;
  windowsAssetUrl: string | null;
  macAssetUrl: string | null;
  releaseUrl: string | null;
}

const EMPTY: LatestRelease = { version: null, windowsAssetUrl: null, macAssetUrl: null, releaseUrl: null };

/**
 * Build-time only (called from .astro frontmatter, never client-side) — a static site has no
 * business making this call per-visitor, and baking the resolved URLs into the built HTML means
 * no rate-limit exposure to real traffic. Returns EMPTY rather than throwing on any failure
 * (no repo yet, no releases yet, rate-limited, offline build) so the site still builds and just
 * shows a "coming soon" state instead of taking the whole build down.
 */
export async function getLatestRelease(): Promise<LatestRelease> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!res.ok) return EMPTY;
    const data = await res.json();
    const assets: Array<{ name: string; browser_download_url: string }> = data.assets ?? [];
    const windowsAsset = assets.find((a) => a.name.toLowerCase().endsWith('.exe'));
    const macAsset = assets.find((a) => a.name.toLowerCase().endsWith('.dmg'));
    return {
      version: typeof data.tag_name === 'string' ? data.tag_name : null,
      windowsAssetUrl: windowsAsset?.browser_download_url ?? null,
      macAssetUrl: macAsset?.browser_download_url ?? null,
      releaseUrl: typeof data.html_url === 'string' ? data.html_url : null,
    };
  } catch {
    return EMPTY;
  }
}

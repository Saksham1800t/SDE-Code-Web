import { GITHUB_REPO } from '../config';

export interface LatestRelease {
  version: string | null;
  windowsAssetUrl: string | null;
  macAssetUrl: string | null;
  releaseUrl: string | null;
  windowsDownloadCount: number | null;
  macDownloadCount: number | null;
}

const EMPTY: LatestRelease = {
  version: null,
  windowsAssetUrl: null,
  macAssetUrl: null,
  releaseUrl: null,
  windowsDownloadCount: null,
  macDownloadCount: null,
};

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
    const assets: Array<{ name: string; browser_download_url: string; download_count: number }> = data.assets ?? [];
    const windowsAsset = assets.find((a) => a.name.toLowerCase().endsWith('.exe'));
    const macAsset = assets.find((a) => a.name.toLowerCase().endsWith('.dmg'));
    return {
      version: typeof data.tag_name === 'string' ? data.tag_name : null,
      windowsAssetUrl: windowsAsset?.browser_download_url ?? null,
      macAssetUrl: macAsset?.browser_download_url ?? null,
      releaseUrl: typeof data.html_url === 'string' ? data.html_url : null,
      windowsDownloadCount: windowsAsset?.download_count ?? null,
      macDownloadCount: macAsset?.download_count ?? null,
    };
  } catch {
    return EMPTY;
  }
}

export interface ReleaseVersion {
  version: string;
  publishedAt: string | null;
  releaseUrl: string | null;
  windowsAssetUrl: string | null;
  macAssetUrl: string | null;
  prerelease: boolean;
  downloadCount: number;
}

/**
 * Every published (non-draft) release that has a real downloadable installer, newest first —
 * same build-time-only contract as getLatestRelease. `/releases` (unlike `/releases/latest`)
 * never 404s on an empty repo, it just returns [], so an empty array is itself a valid
 * "nothing published yet" result.
 *
 * Two things GitHub's response can't be trusted for directly: (1) list order isn't reliably
 * created_at-descending — a release re-published later than its neighbors can still come back
 * out of order — so this sorts explicitly by publish time; (2) a release can exist with zero
 * assets (e.g. one left over from a broken CI run that never finished uploading), which would
 * otherwise show up as an empty, undownloadable row — those are filtered out entirely, since a
 * "version" with no installer isn't something visitors to this page can actually use.
 */
export async function getAllReleases(): Promise<ReleaseVersion[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .map((release: any): ReleaseVersion & { sortKey: number } => {
        const assets: Array<{ name: string; browser_download_url: string; download_count: number }> = release.assets ?? [];
        const windowsAsset = assets.find((a) => a.name.toLowerCase().endsWith('.exe'));
        const macAsset = assets.find((a) => a.name.toLowerCase().endsWith('.dmg'));
        const publishedAt = typeof release.published_at === 'string' ? release.published_at : null;
        return {
          version: typeof release.tag_name === 'string' ? release.tag_name : 'unknown',
          publishedAt,
          releaseUrl: typeof release.html_url === 'string' ? release.html_url : null,
          windowsAssetUrl: windowsAsset?.browser_download_url ?? null,
          macAssetUrl: macAsset?.browser_download_url ?? null,
          prerelease: Boolean(release.prerelease),
          // Only the real installers count — .blockmap/.yml assets are fetched by the
          // auto-updater's own polling, not by someone actually downloading this version.
          downloadCount: (windowsAsset?.download_count ?? 0) + (macAsset?.download_count ?? 0),
          sortKey: publishedAt ? new Date(publishedAt).getTime() : 0,
        };
      })
      .filter((r) => r.windowsAssetUrl || r.macAssetUrl)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  } catch {
    return [];
  }
}

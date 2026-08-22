import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';

interface VersionDownloadStats {
  version: string;
  windowsDownloadCount: number;
  macDownloadCount: number;
  downloadCount: number;
}

interface DownloadStats {
  version: string | null;
  windowsDownloadCount: number;
  macDownloadCount: number;
  totalDownloadCount: number;
  versions: VersionDownloadStats[];
}

interface Props {
  /** The GitHub release tag (e.g. "v0.1.11") this row is for — used to look up its live count. */
  version: string;
  /** The build-time count from lib/releases.ts, shown until the live fetch below resolves. */
  initialValue: number;
  className?: string;
}

const numberFormat = new Intl.NumberFormat('en-US');
const pluralDownloads = (n: number) => (n === 1 ? 'download' : 'downloads');

// Module-level, not per-component-instance — the versions page mounts one of these per release
// row, so without sharing the promise each row would independently hit the backend.
let statsPromise: Promise<DownloadStats | null> | null = null;
function fetchStatsOnce(): Promise<DownloadStats | null> {
  if (!statsPromise) {
    statsPromise = fetch(`${BACKEND_URL}/api/download-stats`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return statsPromise;
}

export default function LiveVersionDownloads({ version, initialValue, className }: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    let cancelled = false;
    fetchStatsOnce().then((stats) => {
      if (cancelled || !stats) return;
      const match = stats.versions.find((v) => v.version === version);
      if (match && match.downloadCount > 0) setValue(match.downloadCount);
    });
    return () => {
      cancelled = true;
    };
  }, [version]);

  if (value <= 0) return null;

  return (
    <span className={className}>
      {numberFormat.format(value)} {pluralDownloads(value)}
    </span>
  );
}

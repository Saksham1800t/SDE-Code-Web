import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';

interface DownloadStats {
  version: string | null;
  windowsDownloadCount: number;
  macDownloadCount: number;
  totalDownloadCount: number;
}

type Kind = 'windows' | 'mac' | 'total';

interface Props {
  kind: Kind;
  /** The build-time count from lib/releases.ts — shown immediately (good for SEO and no-JS),
   * then swapped for a live number once the client fetch below resolves. A static site only
   * fetches GitHub once, at deploy time, so without this the number visitors see would be frozen
   * until the next deploy no matter how many real downloads happened in between. */
  initialValue: number;
  className?: string;
}

const FIELD: Record<Kind, keyof DownloadStats> = {
  windows: 'windowsDownloadCount',
  mac: 'macDownloadCount',
  total: 'totalDownloadCount',
};

const SUFFIX: Record<Kind, string> = {
  windows: '(this version)',
  mac: '(this version)',
  total: 'across all versions',
};

const numberFormat = new Intl.NumberFormat('en-US');
const pluralDownloads = (n: number) => (n === 1 ? 'download' : 'downloads');

// Module-level, not per-component-instance — this page mounts up to three of these (total,
// windows, mac); without sharing the promise each one would independently hit the backend.
let statsPromise: Promise<DownloadStats | null> | null = null;
function fetchStatsOnce(): Promise<DownloadStats | null> {
  if (!statsPromise) {
    statsPromise = fetch(`${BACKEND_URL}/api/download-stats`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return statsPromise;
}

export default function LiveDownloadCount({ kind, initialValue, className }: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    let cancelled = false;
    fetchStatsOnce().then((stats) => {
      if (cancelled || !stats) return;
      const live = stats[FIELD[kind]];
      if (typeof live === 'number' && live > 0) setValue(live);
    });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  if (value <= 0) return null;

  return (
    <p className={className}>
      {numberFormat.format(value)} {pluralDownloads(value)} {SUFFIX[kind]}
    </p>
  );
}

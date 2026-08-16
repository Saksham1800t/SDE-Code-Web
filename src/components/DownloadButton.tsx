import { useEffect, useState } from 'react';

interface DownloadButtonProps {
  version: string | null;
  windowsAssetUrl: string | null;
  macAssetUrl: string | null;
}

type DetectedOS = 'windows' | 'mac' | 'other' | null;

function detectOS(): DetectedOS {
  const ua = navigator.userAgent;
  if (/Win/i.test(ua)) return 'windows';
  if (/Mac/i.test(ua)) return 'mac';
  return 'other';
}

/** Classic VS-Code-homepage pattern: a big primary button for the visitor's own OS, with the
 * other platform still visible as a secondary link — never hidden, since visitors regularly
 * download on behalf of a different machine. OS detection only works client-side (needs
 * navigator), so this renders a neutral/matching-either state during SSR and resolves the real
 * OS after mount — avoids a hydration mismatch instead of guessing on the server. */
export default function DownloadButton({ version, windowsAssetUrl, macAssetUrl }: DownloadButtonProps) {
  const [os, setOs] = useState<DetectedOS>(null);

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const hasAnyRelease = Boolean(windowsAssetUrl || macAssetUrl);

  if (!hasAnyRelease) {
    return (
      <div className="download-button">
        <button className="btn btn--primary" disabled>
          Download — coming soon
        </button>
        <p className="download-button-note">No build has been published yet.</p>
      </div>
    );
  }

  const primaryIsMac = os === 'mac';
  const primaryUrl = primaryIsMac ? macAssetUrl : windowsAssetUrl;
  const primaryLabel = primaryIsMac ? 'Download for macOS' : 'Download for Windows';
  const secondaryUrl = primaryIsMac ? windowsAssetUrl : macAssetUrl;
  const secondaryLabel = primaryIsMac ? 'Windows' : 'macOS';

  return (
    <div className="download-button">
      {primaryUrl ? (
        <a className="btn btn--primary" href={primaryUrl}>
          {primaryLabel}
        </a>
      ) : (
        <button className="btn btn--primary" disabled>
          {primaryLabel} — coming soon
        </button>
      )}
      {secondaryUrl && (
        <a className="btn btn--secondary" href={secondaryUrl}>
          {secondaryLabel}
        </a>
      )}
      {version && <p className="download-button-note">Version {version}</p>}
    </div>
  );
}

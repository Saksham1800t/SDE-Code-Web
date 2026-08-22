import { useState, type FormEvent } from 'react';
import { BACKEND_URL } from '../config';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const MAX_LENGTH = 2000;

/** Fire-and-forget feedback form — the backend never exposes a way to read these back out, so
 * this component only ever needs to show a submit/success/error state, never a list. */
export default function SuggestionForm() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    setErrorText('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: email.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      setMessage('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorText(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="suggestion-success">
        <p>Thanks — your suggestion has been sent.</p>
        <button type="button" className="btn btn--secondary" onClick={() => setStatus('idle')}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="suggestion-form" onSubmit={handleSubmit}>
      <label htmlFor="suggestion-message">Your suggestion</label>
      <textarea
        id="suggestion-message"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="What should SDE Code do better, or what's missing?"
        rows={6}
        required
        disabled={status === 'submitting'}
      />
      <div className="suggestion-char-count">{message.length} / {MAX_LENGTH}</div>

      <label htmlFor="suggestion-email">Email (optional, if you want a reply)</label>
      <input
        id="suggestion-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={status === 'submitting'}
      />

      {status === 'error' && <p className="suggestion-error">{errorText}</p>}

      <button type="submit" className="btn btn--primary" disabled={status === 'submitting' || !message.trim()}>
        {status === 'submitting' ? 'Sending…' : 'Send suggestion'}
      </button>
    </form>
  );
}

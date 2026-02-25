const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let googleScriptPromise = null;

const toBase64 = (value) => value.replace(/-/g, '+').replace(/_/g, '/');

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

export const hasGoogleClientId = () => Boolean(GOOGLE_CLIENT_ID);

export const loadGoogleIdentityScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('google_script_failed')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('google_script_failed'));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
};

export const parseGoogleCredential = (credential) => {
  const parts = credential?.split('.');
  if (!parts || parts.length < 2) return null;

  try {
    const normalized = toBase64(parts[1]);
    const payload = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '='));
    return safeJsonParse(payload);
  } catch (error) {
    return null;
  }
};

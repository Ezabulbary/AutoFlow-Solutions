// Browser Credential Management API helper. After a successful login or
// registration we explicitly ask the browser to store the credentials so its
// password manager reliably offers to save them — single-page navigation
// (fetch + client routing) otherwise doesn't trigger the native save prompt.
// Only works in secure contexts (https) and on localhost; silently no-ops
// elsewhere or in unsupported browsers.
export async function saveCredential({ email, password, name }) {
  try {
    if (typeof window === 'undefined' || !('PasswordCredential' in window)) return;
    const cred = new window.PasswordCredential({
      id: email,
      password,
      name: name || email,
    });
    await navigator.credentials.store(cred);
  } catch {
    // Non-fatal: the form already succeeded.
  }
}

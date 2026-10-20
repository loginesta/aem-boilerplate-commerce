let consentedLoaded = false;

/**
 * Returns the document's URL opt-in, not a stored preference or CMP decision.
 * @returns {boolean} Whether consented scripts should load in this document.
 */
function hasConsent() {
  return new URLSearchParams(window.location.search).get('consent') === 'accept';
}

/** Loads consented scripts once. */
function loadConsented() {
  if (consentedLoaded) return;
  consentedLoaded = true;
  import('./consented.js');
}

/** Notifies listeners of the one-shot decision before loading consented scripts. */
function onConsentUpdate() {
  const consented = hasConsent();
  window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented } }));
  if (consented) {
    loadConsented();
  }
}

onConsentUpdate();

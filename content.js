// Create the overlay once
function ensureOverlay() {
  let overlay = document.getElementById('thread-expander-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'thread-expander-overlay';
  overlay.innerHTML = `
    <div id="thread-expander-container">
      <iframe id="thread-expander-frame" sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `;
  document.documentElement.appendChild(overlay);

  // Close when clicking backdrop
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideOverlay();
  });
  // Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideOverlay();
  });

  return overlay;
}

function showOverlay(src, sandbox) {
  const overlay = ensureOverlay();
  const frame = overlay.querySelector('#thread-expander-frame');

  // Use the current signed URL from the mini insight every time
  frame.src = src || '';
  if (sandbox) frame.setAttribute('sandbox', sandbox);

  overlay.classList.add('active');
}

function hideOverlay() {
  const overlay = document.getElementById('thread-expander-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  // Release resources when hidden
  const frame = overlay.querySelector('#thread-expander-frame');
  if (frame) frame.removeAttribute('src');
}

function addExpandUI(insightIframe) {
  if (!insightIframe || insightIframe.dataset.threadExpanderBound === '1') return;

  // Create a right-aligned row container
  const row = document.createElement('div');
  row.className = 'thread-expander-row';

  const btn = document.createElement('button');
  btn.className = 'thread-expander-button';
  btn.type = 'button';
  btn.innerHTML = `
    <span class="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
    </span>
    <span>Open Thread</span>
  `;

  row.appendChild(btn);
  // Place row right after the mini insight iframe
  insightIframe.insertAdjacentElement('afterend', row);

  btn.addEventListener('click', () => {
    const src = insightIframe.getAttribute('src');
    const sandbox = insightIframe.getAttribute('sandbox') || 'allow-forms allow-modals allow-popups allow-same-origin allow-scripts';
    if (!src) {
      console.warn('[Thread Expander] Insight iframe has no src yet.');
      return;
    }
    showOverlay(src, sandbox);
  });

  // Optional shortcut: Shift+E opens the overlay for this iframe
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'e') {
      const src = insightIframe.getAttribute('src');
      if (src) showOverlay(src, insightIframe.getAttribute('sandbox'));
    }
  }, { passive: true });

  insightIframe.dataset.threadExpanderBound = '1';
}

function scanAndBind() {
  const iframes = document.querySelectorAll('iframe[src*="inbox.getthread.com/autotask/chat"]');
  iframes.forEach(addExpandUI);
}

// Initial scan
scanAndBind();

// Re-scan when page updates (SPA/partial reloads)
const observer = new MutationObserver(scanAndBind);
observer.observe(document.documentElement, { childList: true, subtree: true });

// Debug log (optional)
console.log('[Thread Expander] Ready. Looking for Thread insight iframes…');

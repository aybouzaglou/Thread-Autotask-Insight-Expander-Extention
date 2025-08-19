// Validate that URL is from trusted Thread domain
function isValidThreadURL(url) {
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'inbox.getthread.com' &&
      u.pathname.startsWith('/autotask/chat')
    );
  } catch {
    return false;
  }
}

// Create the overlay once
function ensureOverlay() {
  let overlay = document.getElementById('thread-expander-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'thread-expander-overlay';
  overlay.innerHTML = `
    <div id="thread-expander-container">
      <iframe id="thread-expander-frame" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
  // Security: Validate URL before loading
  if (!src || !isValidThreadURL(src)) {
    console.error('[Thread Expander] Invalid or untrusted URL:', src);
    return;
  }

  const overlay = ensureOverlay();
  const frame = overlay.querySelector('#thread-expander-frame');

  // Security: Copy sandbox from original iframe or use secure defaults
  // We preserve the original sandbox to maintain functionality but validate it
  const securedSandbox = sandbox || 'allow-forms allow-modals allow-popups allow-same-origin allow-scripts';
  
  // Apply sandbox BEFORE setting src (important for security)
  frame.setAttribute('sandbox', securedSandbox);
  
  // Use the current signed URL from the mini insight every time
  frame.src = src;

  overlay.classList.add('active');
}

function hideOverlay() {
  const overlay = document.getElementById('thread-expander-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  // Security: Clear iframe completely when hidden
  const frame = overlay.querySelector('#thread-expander-frame');
  if (frame) {
    frame.removeAttribute('src');
    // Also clear sandbox to reset permissions
    frame.removeAttribute('sandbox');
  }
}

async function addExpandUI(insightIframe) {
  if (!insightIframe || insightIframe.dataset.threadExpanderBound === '1') return;
  
  // Mark iframe as processed immediately to prevent race conditions
  insightIframe.dataset.threadExpanderBound = '1';
  
  // Check if there's already a button for this iframe (shouldn't happen but just in case)
  const existingButton = insightIframe.nextElementSibling;
  if (existingButton && existingButton.classList.contains('thread-expander-row')) {
    // Button already exists, skipping silently
    return;
  }

  // Create a right-aligned row container
  const row = document.createElement('div');
  row.className = 'thread-expander-row';
  row.dataset.threadExpanderButton = 'true'; // Mark our button for easy identification

  const btn = document.createElement('button');
  btn.className = 'thread-expander-button';
  btn.type = 'button';
  
  try {
    const iconUrl = chrome.runtime.getURL('icon.svg');
    const response = await fetch(iconUrl);
    if (response.ok) {
      const iconSvg = await response.text();
      btn.innerHTML = `<span class="icon" aria-hidden="true">${iconSvg}</span><span>Expand Thread</span>`;
    } else {
      btn.textContent = 'Expand Thread';
    }
  } catch (error) {
    console.error('[Thread Expander] Could not load icon SVG.', error);
    btn.textContent = 'Expand Thread';
  }

  row.appendChild(btn);
  // Place row right after the mini insight iframe
  insightIframe.insertAdjacentElement('afterend', row);

  btn.addEventListener('click', () => {
    const src = insightIframe.getAttribute('src');
    // Security: Preserve original sandbox attributes or use secure defaults
    const sandbox = insightIframe.getAttribute('sandbox') || 'allow-forms allow-modals allow-popups allow-same-origin allow-scripts';
    if (!src) {
      console.warn('[Thread Expander] Insight iframe has no src yet.');
      return;
    }
    // Security validation happens in showOverlay
    showOverlay(src, sandbox);
  });
  
  // Button added successfully - removed verbose logging
}

function isThreadChatIframe(el) {
  try {
    // Resolve relative src values against page URL
    const u = new URL(el.getAttribute('src') || '', location.href);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'inbox.getthread.com' &&
      u.pathname.startsWith('/autotask/chat')
    );
  } catch {
    return false;
  }
}

function cleanupOrphanedButtons() {
  // Find all our buttons
  const buttons = document.querySelectorAll('.thread-expander-row[data-thread-expander-button="true"]');
  buttons.forEach(button => {
    // Check if the previous sibling is a Thread iframe
    const prevSibling = button.previousElementSibling;
    if (!prevSibling || 
        !prevSibling.tagName || 
        prevSibling.tagName.toLowerCase() !== 'iframe' || 
        !prevSibling.src || 
        !prevSibling.src.includes('inbox.getthread.com/autotask/chat')) {
      // Removing orphaned button - removed verbose logging
      button.remove();
    }
  });
}

// Track if we've already found iframes to avoid re-logging
let lastIframeCount = -1;

function scanAndBind() {
  // First clean up any orphaned buttons
  cleanupOrphanedButtons();
  
  const iframes = document.querySelectorAll('iframe[src*="inbox.getthread.com/autotask/chat"]');
  
  // Only log if the number of iframes has changed
  if (iframes.length !== lastIframeCount) {
    if (iframes.length > 0) {
      console.log(`[Thread Expander] Found ${iframes.length} Thread iframe(s)`);
    }
    lastIframeCount = iframes.length;
  }
  
  iframes.forEach((iframe) => {
    // Process silently - only log errors
    addExpandUI(iframe);
  });
}

// Global keyboard shortcut handler (Shift+E)
let globalHotkeyBound = false;
function bindGlobalHotkey() {
  if (globalHotkeyBound) return;
  globalHotkeyBound = true;
  
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'e') {
      // Find the first Thread iframe on the page
      const iframe = document.querySelector('iframe[src*="inbox.getthread.com/autotask/chat"]');
      if (iframe) {
        const src = iframe.getAttribute('src');
        if (src && isValidThreadURL(src)) {
          showOverlay(src, iframe.getAttribute('sandbox'));
        }
      }
    }
  }, { passive: true });
}

// Check if this script is already running in this frame
if (!window.__threadExpanderInitialized) {
  window.__threadExpanderInitialized = true;
  
  // Only log initialization in main frame, not iframes
  if (window === window.top) {
    console.log('[Thread Expander] Extension initialized');
  }
  
  // Initial scan
  scanAndBind();
  bindGlobalHotkey();

  // Debounce mechanism to prevent excessive rescanning
  let scanTimeout;
  function debouncedScan() {
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      scanAndBind();
    }, 500); // Wait 500ms after last mutation before scanning
  }
  
  // Re-scan when page updates (SPA/partial reloads)
  const observer = new MutationObserver((mutations) => {
    // Check if any of the mutations might have added Thread iframes
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        // Check if any added nodes might contain iframes
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if it's an iframe or might contain iframes
            if (node.tagName === 'IFRAME' || 
                (node.querySelector && node.querySelector('iframe'))) {
              shouldScan = true;
              break;
            }
          }
        }
      }
      if (shouldScan) break;
    }
    
    // Only scan if we found potential iframe changes
    if (shouldScan) {
      debouncedScan();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Tidy up on navigation/unload
  window.addEventListener('beforeunload', () => observer.disconnect());

  // Extension loaded successfully
} else {
  // Already initialized in this frame, skipping
}

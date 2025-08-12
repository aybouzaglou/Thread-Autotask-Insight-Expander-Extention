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

let threadExpanderHotkeyBound = false;
function bindThreadHotkey(insightIframe) {
  if (threadExpanderHotkeyBound) return;
  threadExpanderHotkeyBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'e') {
      const src = insightIframe.getAttribute('src');
      if (src) showOverlay(src, insightIframe.getAttribute('sandbox'));
    }
  }, { passive: true });
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
      <svg width="14" height="15" viewBox="0 0 31 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_14805_48844)">
          <g filter="url(#filter1_dii_14805_48844)">
            <path d="M3.39062 9.05424C3.39062 7.17473 4.91427 5.65109 6.79378 5.65109H23.5968C25.4764 5.65109 27 7.17474 27 9.05425V23.1818C27 25.0613 25.4764 26.585 23.5968 26.585H6.79378C4.91427 26.585 3.39062 25.0613 3.39062 23.1818V9.05424Z" fill="white"></path>
          </g>
        </g>
        <g filter="url(#filter2_iii_14805_48844)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.36974 7.24193C6.09179 7.24193 5.0558 8.27791 5.0558 9.55586V17.4739C5.0558 18.7518 6.09179 19.7878 7.36974 19.7878H11.9329C11.9283 19.8474 11.9259 19.9077 11.9259 19.9686V21.234C11.9259 22.5119 12.9619 23.5479 14.2399 23.5479H16.1199C17.3979 23.5479 18.4339 22.5119 18.4339 21.234V19.9686C18.4339 19.9077 18.4315 19.8474 18.4269 19.7878H23.2419C24.5198 19.7878 25.5558 18.7518 25.5558 17.4739V9.55586C25.5558 8.27791 24.5198 7.24193 23.2419 7.24193H7.36974Z" fill="url(#paint0_linear_14805_48844)"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.36974 7.24193C6.09179 7.24193 5.0558 8.27791 5.0558 9.55586V17.4739C5.0558 18.7518 6.09179 19.7878 7.36974 19.7878H11.9329C11.9283 19.8474 11.9259 19.9077 11.9259 19.9686V21.234C11.9259 22.5119 12.9619 23.5479 14.2399 23.5479H16.1199C17.3979 23.5479 18.4339 22.5119 18.4339 21.234V19.9686C18.4339 19.9077 18.4315 19.8474 18.4269 19.7878H23.2419C24.5198 19.7878 25.5558 18.7518 25.5558 17.4739V9.55586C25.5558 8.27791 24.5198 7.24193 23.2419 7.24193H7.36974Z" fill="url(#paint1_linear_14805_48844)" fill-opacity="0.2" style="mix-blend-mode: soft-light;"></path>
        </g>
        <path d="M11.9213 1.31745H12.4504C13.4088 1.31745 14.187 2.09566 14.187 3.0541V5.31983H11.9213C10.9628 5.31983 10.1846 4.54162 10.1846 3.58318V3.0541C10.1846 2.09566 10.9628 1.31745 11.9213 1.31745Z" fill="white"></path>
        <path d="M14.1865 13.3244H16.4522C17.4106 13.3244 18.1889 14.1026 18.1889 15.0611V15.5901C18.1889 16.5486 17.4106 17.3268 16.4522 17.3268H15.9231C14.9647 17.3268 14.1865 16.5486 14.1865 15.5901V13.3244Z" fill="white"></path>
        <path d="M14.1865 5.31964H17.7863C18.7448 5.31964 19.523 6.09785 19.523 7.05629V7.58537C19.523 8.54381 18.7448 9.32202 17.7863 9.32202H14.1865V5.31964Z" fill="#FFF7AA"></path>
        <path d="M10.5858 9.32202H14.1857V13.3244H10.5858C9.62736 13.3244 8.84915 12.5462 8.84915 11.5878V11.0587C8.84915 10.1002 9.62736 9.32202 10.5858 9.32202Z" fill="#00BB99"></path>
        <path d="M16.1879 17.7436C14.8545 17.7436 13.7699 16.6588 13.7699 15.3256V13.7414H10.8516C9.51823 13.7414 8.43361 12.6566 8.43361 11.3234C8.43361 9.99023 9.51842 8.90542 10.8516 8.90542H13.7699V5.73682H12.1857C10.8524 5.73682 9.76774 4.65201 9.76774 3.31883C9.76774 1.98566 10.8525 0.900848 12.1857 0.900848C13.5189 0.900848 14.6037 1.98566 14.6037 3.31883V4.90304H17.522C18.8554 4.90304 19.94 5.98785 19.94 7.32102C19.94 8.6542 18.8552 9.73901 17.522 9.73901H14.6037V12.9076H16.1879C17.5213 12.9076 18.6059 13.9924 18.6059 15.3256C18.6059 16.6588 17.5211 17.7436 16.1879 17.7436ZM14.6037 13.7412V15.3254C14.6037 16.199 15.3144 16.9096 16.1879 16.9096C17.0615 16.9096 17.7721 16.199 17.7721 15.3254C17.7721 14.4518 17.0615 13.7412 16.1879 13.7412H14.6037ZM10.8516 9.73882C9.97804 9.73882 9.26739 10.4495 9.26739 11.323C9.26739 12.1966 9.97804 12.9072 10.8516 12.9072H13.7699V9.73863H10.8516V9.73882ZM14.6037 8.90504H17.522C18.3956 8.90504 19.1062 8.19439 19.1062 7.32083C19.1062 6.44728 18.3956 5.73663 17.522 5.73663H14.6037V8.90523V8.90504ZM12.1855 1.73425C11.312 1.73425 10.6013 2.4449 10.6013 3.31845C10.6013 4.19201 11.312 4.90266 12.1855 4.90266H13.7697V3.31845C13.7697 2.4449 13.0591 1.73425 12.1855 1.73425Z" fill="black"></path>
        <defs>
          <filter id="filter0_dd_14805_48844" x="0.271068" y="4.9421" width="29.8485" height="27.173" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="0.70899"></feOffset>
            <feGaussianBlur stdDeviation="0.567192"></feGaussianBlur>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14805_48844"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="2.41057"></feOffset>
            <feGaussianBlur stdDeviation="1.55978"></feGaussianBlur>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
            <feBlend mode="normal" in2="effect1_dropShadow_14805_48844" result="effect2_dropShadow_14805_48844"></feBlend>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_14805_48844" result="shape"></feBlend>
          </filter>
          <filter id="filter1_dii_14805_48844" x="2.82343" y="4.8003" width="24.7438" height="22.6355" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="0.283596"></feOffset>
            <feGaussianBlur stdDeviation="0.283596"></feGaussianBlur>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"></feColorMatrix>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14805_48844"></feBlend>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14805_48844" result="shape"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="-0.850788"></feOffset>
            <feGaussianBlur stdDeviation="0.567192"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0.6 0 0 0 0 0.894118 0 0 0 0 0.839216 0 0 0 1 0"></feColorMatrix>
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_14805_48844"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="0.070899"></feOffset>
            <feGaussianBlur stdDeviation="0.141798"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.733333 0 0 0 0 0.6 0 0 0 1 0"></feColorMatrix>
            <feBlend mode="normal" in2="effect2_innerShadow_14805_48844" result="effect3_innerShadow_14805_48844"></feBlend>
          </filter>
          <filter id="filter2_iii_14805_48844" x="4.77221" y="6.95833" width="21.0672" height="16.8732" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dx="0.283596" dy="0.283596"></feOffset>
            <feGaussianBlur stdDeviation="0.141798"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></feColorMatrix>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_14805_48844"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dx="-0.283596" dy="-0.283596"></feOffset>
            <feGaussianBlur stdDeviation="0.141798"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
            <feBlend mode="normal" in2="effect1_innerShadow_14805_48844" result="effect2_innerShadow_14805_48844"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="-0.638091"></feOffset>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.65 0"></feColorMatrix>
            <feBlend mode="normal" in2="effect2_innerShadow_14805_48844" result="effect3_innerShadow_14805_48844"></feBlend>
          </filter>
          <linearGradient id="paint0_linear_14805_48844" x1="15.3058" y1="7.63056" x2="15.3058" y2="23.5479" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00BB99"></stop>
            <stop offset="1" stop-color="#99EE99"></stop>
          </linearGradient>
          <linearGradient id="paint1_linear_14805_48844" x1="15.3058" y1="7.24193" x2="15.3058" y2="23.5479" gradientUnits="userSpaceOnUse">
            <stop offset="0.328125" stop-color="white"></stop>
            <stop offset="1" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>
      </svg>
    </span>
    <span>Expand Thread</span>
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
  bindThreadHotkey(insightIframe);

  insightIframe.dataset.threadExpanderBound = '1';
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

function scanAndBind() {
  const iframes = Array.from(document.querySelectorAll('iframe[src]')).filter(isThreadChatIframe);
  iframes.forEach(addExpandUI);
}

// Initial scan
scanAndBind();

// Re-scan when page updates (SPA/partial reloads)
const observer = new MutationObserver(scanAndBind);
observer.observe(document.documentElement, { childList: true, subtree: true });

// Tidy up on navigation/unload
window.addEventListener('beforeunload', () => observer.disconnect());

// Debug log (optional)
console.log('[Thread Expander] Ready. Looking for Thread insight iframes…');

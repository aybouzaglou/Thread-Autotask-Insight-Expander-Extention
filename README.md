# Autotask Thread Insight Expander

A tiny Chrome extension that adds a clean "Expand Thread" button next to the Thread messenger insight on Autotask ticket pages. Clicking it opens the same signed Thread view in a larger overlay so you can actually read and respond without squinting.

**Version 0.2.0** - Security hardening and performance improvements

## Demo
![Demo](https://github.com/user-attachments/assets/116ae1c3-7cc3-4494-ac1f-e42956532bbe)


I am not affiliated with Thread (getthread.com) or Autotask. I built this to make working tickets a little less annoying.

## What it does
- Finds the mini Thread insight iframe on Autotask ticket pages
- Adds a subtle, right‑aligned "Expand Thread" button
- Opens the same signed Thread view in a centered overlay (no backend work, no extra auth)
- Once expanded, you can use Thread’s own "View in Inbox" action to open the ticket in the full Thread Inbox UI — something that’s awkward/not possible from the default Autotask insight view
- Close with Esc or by clicking the backdrop
- Shortcut: press Shift+E to open the overlay for the current insight

## Why
The mini insight is useful, but it’s cramped. This keeps the exact same experience and simply gives it room to breathe. No hacks, no scraping, no rerouting—just reusing the iframe URL you already have access to.

## Install (Chromium based browsers)
Quick Start: Install the Extension

### Option 1: Load Unpacked (Preferred for Development)

Download or clone this repo.

Go to chrome://extensions or edge://extensions and enable Developer mode (top right).

Click Load unpacked and select the extension root folder.

Open a ticket page like https://*.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?....

When the Thread insight appears, use the "Expand Thread" button under it—or press Shift+E.

### Option 2: Load from ZIP

Download the latest release ZIP from [Releases.](https://github.com/aybouzaglou/Thread-Autotask-Insight-Expander-Extention/releases)

Unzip to a convenient location.

Go to chrome://extensions → Developer mode → Load unpacked → Select the unzipped folder

## Notes
- The overlay size is controlled in `content.css` (`#thread-expander-container`). Tweak to taste.
- The content script runs in all frames on `autotask.net` so it can find the insight even if Autotask nests it.
- No data is collected. There's no background script.
- All iframe URLs are validated to only load from `inbox.getthread.com`.
- Console logging is minimal to avoid spam.

## Files
- `manifest.json` – MV3 config
- `content.js` – Finds the insight iframe, adds the button, opens the overlay
- `content.css` – Styles for the overlay and the button
- `SECURITY.md` – Security documentation and threat model
- `WARP.md` – Development guidelines for AI assistants

## Changelog

### v0.2.0
- Added URL validation to only load Thread domains
- Fixed excessive console logging that was firing every second
- Added debouncing to MutationObserver (500ms delay)
- Improved security with proper sandbox attribute management
- Added security documentation
- Optimized performance by only scanning when iframes are detected

### v0.1.0
- Initial release

## Credit
All credit for the messenger goes to Thread (getthread.com). This is just a front‑end convenience layer to make it easier to use inside Autotask.
GPT 5 for Helping me with the code

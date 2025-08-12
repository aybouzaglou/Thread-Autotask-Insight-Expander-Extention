# Autotask Thread Insight Expander

A tiny Chrome extension that adds a clean "Expand Thread" button next to the Thread messenger insight on Autotask ticket pages. Clicking it opens the same signed Thread view in a larger overlay so you can actually read and respond without squinting.

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

## Install (Chrome)
1) Download or clone this folder.
2) Go to chrome://extensions and switch on Developer mode.
3) Click "Load unpacked" and select this folder.
4) Visit a ticket page like `https://*.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?...`.
5) When the Thread insight appears, use the "Expand Thread" button under it (or press Shift+E).

## Notes
- The overlay size is controlled in `content.css` (`#thread-expander-container`). Tweak to taste.
- The content script runs in all frames on `autotask.net` so it can find the insight even if Autotask nests it.
- No data is collected. There’s no background script.

## Files
- `manifest.json` – MV3 config
- `content.js` – Finds the insight iframe, adds the button, opens the overlay
- `content.css` – Styles for the overlay and the button

## Credit
All credit for the messenger goes to Thread (getthread.com). This is just a front‑end convenience layer to make it easier to use inside Autotask.
GPT 5 for Helping me with the code

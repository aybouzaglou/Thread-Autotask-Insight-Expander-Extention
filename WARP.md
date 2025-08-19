# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Chrome extension that enhances the Thread messenger integration within Autotask ticket pages. It adds an "Expand Thread" button that opens the cramped Thread insight iframe in a larger overlay for better readability and usability.

## Architecture

### Core Components

The extension consists of three main files working together:
- **manifest.json**: Chrome Extension Manifest V3 configuration that injects the content script into all Autotask pages
- **content.js**: Main logic that detects Thread iframes, adds UI controls, and manages the overlay
- **content.css**: Styling for the overlay and expand button

### How It Works

1. **Iframe Detection**: The content script continuously scans for Thread insight iframes on Autotask pages using a MutationObserver. It identifies Thread iframes by checking if the src matches `https://inbox.getthread.com/autotask/chat*`

2. **UI Injection**: When a Thread iframe is found, the script adds a right-aligned "Expand Thread" button beneath it. The button includes a custom Slack-style icon SVG.

3. **Overlay Management**: Clicking the button or pressing Shift+E opens a fullscreen overlay containing the same Thread iframe URL but in a larger container (1200px × 900px max). The overlay can be closed via Escape key or clicking the backdrop.

4. **State Management**: The script tracks which iframes have been processed using data attributes to avoid duplicate button additions. The overlay is created once and reused for all expansions.

## Common Development Tasks

### Testing the Extension Locally
```bash
# 1. Open Chrome and navigate to extensions page
open -a "Google Chrome" chrome://extensions

# 2. Enable Developer mode (toggle in top right)
# 3. Click "Load unpacked" and select this directory
# 4. Navigate to any Autotask ticket page to test
```

### Reloading After Changes
```bash
# After modifying any files, reload the extension:
# 1. Go to chrome://extensions
# 2. Click the refresh icon on the extension card
# 3. Refresh any Autotask pages to see changes
```

### Packaging for Distribution
```bash
# Create a .crx file for distribution (requires Chrome Developer Dashboard)
# For now, distribution is via "Load unpacked" method
zip -r thread-expander.zip manifest.json content.js content.css README.md
```

### Version Bumping
```bash
# Update version in manifest.json before releasing
# Current: 0.1.0
```

## Key Implementation Details

### Content Script Injection
- Runs on all frames (`all_frames: true`) to catch nested iframes
- Executes at `document_idle` to ensure DOM is ready
- Matches all Autotask subdomains: `https://*.autotask.net/*`

### Iframe Sandbox Attributes
The extension preserves the original iframe's sandbox attributes when expanding:
- `allow-forms`
- `allow-modals` 
- `allow-popups`
- `allow-same-origin`
- `allow-scripts`

### Keyboard Shortcut
- **Shift+E**: Opens the overlay for the current Thread insight iframe
- Only one global listener is registered regardless of iframe count

### CSS Z-Index Strategy
- Overlay uses maximum z-index (2147483647) to ensure it appears above all page elements
- Button styling uses `!important` on color to override Autotask's CSS

## Important Constraints

1. **No Background Script**: This extension operates entirely as a content script with no persistent background processes
2. **No External Dependencies**: Pure vanilla JavaScript - no frameworks or libraries
3. **CSP Compliance**: Strict Content Security Policy is defined but only affects extension pages (not content scripts)
4. **Frame Access**: Must run in all frames since Autotask may nest the Thread insight in iframes

## Debugging

Enable debug logging by checking the console for:
```
[Thread Expander] Ready. Looking for Thread insight iframes…
```

If the button doesn't appear:
1. Check if the Thread iframe URL matches the expected pattern
2. Verify content script is injected (check Sources tab in DevTools)
3. Look for console errors related to CSP or permissions

## Testing URLs

Thread insight iframes typically appear on:
- `https://*.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?*`
- Any ticket detail page where Thread integration is enabled

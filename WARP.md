# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

**IMPORTANT**: When making changes to this extension, always update this WARP.md file to reflect the current implementation. This ensures future AI assistants have accurate context.

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
# Current: 0.2.0
# Remember to update WARP.md with new version details
```

## Key Implementation Details

### Security Validations (Added v0.2.0)
- **URL Validation**: `isValidThreadURL()` function validates all iframe URLs before loading
  - Only allows `https://` protocol
  - Only allows `inbox.getthread.com` hostname  
  - Only allows paths starting with `/autotask/chat`
- **Sandbox Management**: 
  - Sandbox attributes applied BEFORE setting iframe src (security critical)
  - Both src and sandbox cleared when overlay is hidden
  - Preserves original iframe's sandbox attributes when expanding

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

### Performance Optimizations (Added v0.2.0)
- **MutationObserver Debouncing**: 500ms delay prevents excessive DOM scanning
- **Smart Mutation Detection**: Only scans when iframe elements detected in mutations
- **Reduced Logging**: 
  - Tracks `lastIframeCount` to avoid duplicate console messages
  - Only logs when iframe count changes or errors occur
  - Silent processing for already-bound iframes
- **Efficient Node Checking**: Checks nodeType and tagName before querySelector

## Important Constraints

1. **No Background Script**: This extension operates entirely as a content script with no persistent background processes
2. **No External Dependencies**: Pure vanilla JavaScript - no frameworks or libraries
3. **CSP Compliance**: Strict Content Security Policy is defined but only affects extension pages (not content scripts)
4. **Frame Access**: Must run in all frames since Autotask may nest the Thread insight in iframes
5. **URL Security** (v0.2.0+): All iframe URLs must pass `isValidThreadURL()` validation
6. **Performance** (v0.2.0+): Must avoid excessive DOM scanning and console spam

## Debugging

### Console Output (v0.2.0+)
Minimal logging to avoid spam:
- On load (main frame only): `[Thread Expander] Extension initialized`
- When iframe count changes: `[Thread Expander] Found X Thread iframe(s)`  
- On errors: `[Thread Expander] Invalid or untrusted URL: [url]`
- On missing src: `[Thread Expander] Insight iframe has no src yet.`

If the button doesn't appear:
1. Check if the Thread iframe URL matches `https://inbox.getthread.com/autotask/chat*`
2. Verify iframe passed `isValidThreadURL()` validation (check for "Invalid or untrusted URL" errors)
3. Verify content script is injected (check Sources tab in DevTools)
4. Look for console errors related to CSP or permissions
5. Check if iframe has `data-thread-expander-bound="1"` attribute (already processed)

## Testing URLs

Thread insight iframes typically appear on:
- `https://*.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?*`
- Any ticket detail page where Thread integration is enabled

## Changelog Integration

When updating this extension:
1. Update the version in `manifest.json`
2. Update the README.md changelog section
3. **Update this WARP.md file with implementation changes**
4. Document any new functions, security measures, or performance optimizations
5. Update debugging instructions if logging behavior changes

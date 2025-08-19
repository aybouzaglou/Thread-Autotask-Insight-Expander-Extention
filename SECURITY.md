# Security Documentation

## Overview
This Chrome extension implements multiple layers of security to ensure safe operation while maintaining functionality with the Thread messenger integration.

## Security Measures Implemented

### 1. URL Validation
- **Function**: `isValidThreadURL()`
- All iframe URLs are validated before loading to ensure they only come from the trusted Thread domain
- Only allows HTTPS protocol
- Only allows `inbox.getthread.com` hostname
- Only allows paths starting with `/autotask/chat`
- Prevents loading of arbitrary or malicious URLs

### 2. Sandbox Attribute Management
- The iframe sandbox attributes (`allow-scripts` and `allow-same-origin`) are necessary for Thread's functionality
- These are only applied to validated Thread URLs
- Sandbox attributes are cleared when the overlay is hidden to reset permissions
- The sandbox is applied BEFORE setting the src attribute (important for security)

### 3. Content Security Policy (CSP)
- Strict CSP defined in manifest.json for extension pages
- Prevents inline scripts except from 'self'
- Blocks all external connections except to necessary domains
- Prevents object embeds and restricts frame ancestors

### 4. Minimal Permissions
- No special Chrome API permissions requested
- Only operates on Autotask domains (`https://*.autotask.net/*`)
- No access to tabs, storage, or other sensitive APIs
- Content script only runs at `document_idle` after DOM is ready

### 5. Input Sanitization
- No user input is directly injected into HTML
- SVG icon is fetched securely using Chrome's runtime.getURL
- All iframe attributes are set via DOM methods, not innerHTML

### 6. Resource Cleanup
- Iframe src and sandbox attributes are cleared when overlay is hidden
- This prevents lingering connections and resets security context
- MutationObserver is properly disconnected on page unload

## Why `allow-scripts` + `allow-same-origin` is Necessary

The Chrome warning about this combination is valid but in our case necessary:

1. **`allow-scripts`**: Required for Thread's JavaScript to run (chat functionality, real-time updates)
2. **`allow-same-origin`**: Required for Thread to access its own cookies and localStorage for authentication

Without both, the Thread integration would not function. However, we mitigate risks by:
- Only loading from the validated Thread domain
- Clearing permissions when not in use
- Operating in a sandboxed iframe environment

## Security Best Practices for Users

1. Only install this extension from trusted sources
2. Keep the extension updated to receive security patches
3. Report any suspicious behavior immediately
4. The extension only operates on Autotask pages - it cannot access other websites

## Threat Model

### What This Extension Protects Against:
- Loading malicious URLs in the expanded iframe
- XSS attacks through URL manipulation
- Unauthorized access to other domains
- Persistent iframe connections when not needed

### Accepted Risks:
- Thread's iframe could theoretically escape its sandbox (mitigated by domain validation)
- Thread has access to its own origin (necessary for functionality)

## Reporting Security Issues

If you discover a security vulnerability, please report it privately rather than opening a public issue.

## Compliance

This extension follows Chrome Extension Manifest V3 security best practices:
- No remote code execution
- No eval() or inline scripts
- Strict CSP policies
- Minimal permission scope
- Secure communication patterns

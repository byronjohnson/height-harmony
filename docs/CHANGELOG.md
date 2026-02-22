# Changelog

All notable changes to Height Harmony are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-02-22

This is a full rewrite of Height Harmony. The v1 API is preserved — `heightHarmony('.card')` still works as a drop-in — but the internals, options, and output formats are entirely new.

### ✨ Added

#### Core library
- **`ResizeObserver` integration** — Heights re-sync automatically whenever any element changes size, with no `window.resize` listener needed
- **`MutationObserver` integration** — Watches parent containers for new or removed elements; new cards/items picked up automatically with no manual re-init
- **Options object** — Pass a configuration object as the second argument:
  - `debounce` (number, default `0`) — milliseconds to debounce observer callbacks; `0` uses `requestAnimationFrame` only
  - `minHeight` (boolean, default `false`) — use `min-height` instead of `height`, letting elements grow taller than the max if content is added
  - `breakpoint` (number, default `0`) — disable equalizing below this viewport width (px); useful for letting mobile layouts stack naturally
  - `watch` (boolean, default `true`) — set `false` to skip observer setup (fire-and-forget mode)
  - `transitions` (boolean, default `true`) — apply a `0.2s ease` CSS transition on height changes for smooth animation
- **`HeightHarmonyInstance` class** with chainable instance methods:
  - `.refresh()` — manually trigger a height re-calculation
  - `.destroy()` — disconnect all observers, remove all inline `height`/`min-height`/`transition` styles, and mark the instance as destroyed
- **`heightHarmony.autoInit(opts?)`** static method — scans the document for `[data-hh-group]` attributes and harmonizes each group automatically; returns an array of instances
- **`data-hh-group` HTML attribute** — declarative markup API; elements sharing the same group name are equalized together with a single `autoInit()` call
- **`heightHarmony.version`** static property — returns `"2.0.0"`
- **ESM build** (`dist/height-harmony.es.js`) — tree-shakeable ES module for bundlers
- **UMD build** (`dist/height-harmony-min.js`) — works as a plain `<script>` tag, CommonJS `require`, or AMD define; exposes `window.heightHarmony` globally
- **Fallback for old browsers** — automatically falls back to a debounced `window.resize` + `orientationchange` listener when `ResizeObserver` is unavailable (e.g., very old Safari)

#### Build & tooling
- **Vite + Terser build pipeline** — produces minified, optimised ESM and UMD bundles in a single command (`npm run build`)

#### Project
- Published to the public NPM registry as **`height-harmony`** (previously only available as a GitHub Package)
- Demo site extracted into a separate private repo (`height-harmony-site`); Vercel deployment is managed there

---

### 🐛 Fixed

- **Listener leak — `resize` event** — `destroy()` now correctly calls the stored `_cleanupFallback()` function to remove the `window.resize` listener added by the ResizeObserver fallback path. Previously the listener remained attached forever after `destroy()`.
- **Listener leak — `orientationchange` event** — The `orientationchange` listener (also part of the fallback path) was never removed. It is now named, stored in `_cleanupFallback`, and removed by `destroy()`.
- **Style leak — `transition` inline property** — When `transitions: true`, Height Harmony sets a `transition: height 0.2s ease` inline style. Previously `destroy()` did not remove this property, leaving a lingering inline style that could interfere with other CSS animations. `destroy()` now calls `el.style.removeProperty('transition')`.

---

### ♻️ Changed

- **Package name** — renamed from `@byronjohnson/height-harmony` (GitHub Packages, scoped) to `height-harmony` (public npmjs.com)
- **Import path** — update any existing imports:
  ```js
  // Before
  import heightHarmony from '@byronjohnson/height-harmony';
  // After
  import heightHarmony from 'height-harmony';
  ```
- **CDN URLs** — update any `<script src>` tags:
  ```html
  <!-- Before -->
  <script src="https://unpkg.com/@byronjohnson/height-harmony@1/..."></script>
  <!-- After -->
  <script src="https://unpkg.com/height-harmony@2/dist/height-harmony-min.js"></script>
  ```
- **`_sync()` internals** — now uses a single-pass `forEach` for measuring heights instead of `map()` (removes an unused intermediate array allocation)

---

### 🗑️ Removed

- **`naturalHeight()` internal helper** — was defined in the source but never called; the sync routine uses `offsetHeight` directly after clearing inline heights in a single batch

---

### 📦 Published package contents

| File | Size | Gzipped |
|---|---|---|
| `height-harmony.js` (source) | 11.0 kB | — |
| `dist/height-harmony.es.js` | 7.1 kB | 2.15 kB |
| `dist/height-harmony-min.js` | 4.0 kB | **1.56 kB** |
| `README.md` | 6.9 kB | — |
| `LICENSE` | 1.1 kB | — |

---

### 🔄 Migration from v1

v1 had a single export with no options:

```js
heightHarmony('.card'); // v1 — still works in v2 ✅
```

Everything is backwards-compatible. The only breaking change is the **package name**. Existing CSS, HTML, and JavaScript that calls `heightHarmony(selector)` requires no changes.

---

## [1.x] — Prior releases

Version 1.x was a minimal single-function utility with no options, no observers, and a window resize listener only. It was distributed exclusively via the GitHub Package Registry as `@byronjohnson/height-harmony`.

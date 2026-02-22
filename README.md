# Height Harmony

**The fastest, smartest equal-height JavaScript utility on the web.**

Zero dependencies. ResizeObserver-powered. Automatically responsive. Drop it in and forget it.

[![npm version](https://img.shields.io/badge/npm-v2.0.0-45c4b0?style=flat-square)](https://www.npmjs.com/package/@byronjohnson/height-harmony)
[![License: MIT](https://img.shields.io/badge/License-MIT-dafdba?style=flat-square)](LICENSE)
[![gzip size](https://img.shields.io/badge/gzip-%3C2KB-9aeba3?style=flat-square)](#)

**[View the interactive demo →](https://byronjohnson.github.io/height-harmony/demo/)**

---

## What's New in v2.0

| Feature | v1 | v2 |
|---|---|---|
| ResizeObserver (auto-reactive) | ❌ | ✅ |
| MutationObserver (dynamic content) | ❌ | ✅ |
| Options object | ❌ | ✅ |
| `destroy()` / `refresh()` methods | ❌ | ✅ |
| Breakpoint support | ❌ | ✅ |
| `data-hh-group` HTML attribute | ❌ | ✅ |
| ESM + UMD build | ❌ | ✅ |
| Zero layout thrash | partial | ✅ |

---

## Installation

### npm / yarn / pnpm

```bash
npm install @byronjohnson/height-harmony
```

### CDN (UMD — no bundler needed)

```html
<script src="https://unpkg.com/@byronjohnson/height-harmony@2/dist/height-harmony-min.js"></script>
<script>
  heightHarmony('.card');
</script>
```

### CDN (ES Module)

```html
<script type="module">
  import heightHarmony from 'https://unpkg.com/@byronjohnson/height-harmony@2/dist/height-harmony.es.js';
  heightHarmony('.card');
</script>
```

---

## Quick Start

```javascript
import heightHarmony from '@byronjohnson/height-harmony';

// Basic — equalize all matching elements
heightHarmony('.card');

// With options
heightHarmony('.card', { debounce: 100, breakpoint: 768 });

// Store the instance
const hh = heightHarmony('.card');
hh.refresh();  // manual re-trigger
hh.destroy();  // clean up all observers and remove inline styles
```

---

## API Reference

### `heightHarmony(target, options?)`

**Parameters**

| Parameter | Type | Description |
|---|---|---|
| `target` | `string \| NodeList \| HTMLElement[]` | CSS selector string or a collection of elements |
| `options` | `HeightHarmonyOptions` | *(optional)* Configuration object |

**Returns** `HeightHarmonyInstance`

---

### Options

```typescript
interface HeightHarmonyOptions {
  /**
   * Milliseconds to debounce ResizeObserver / MutationObserver callbacks.
   * 0 = no debounce, only requestAnimationFrame (default).
   * @default 0
   */
  debounce?: number;

  /**
   * Use `min-height` instead of `height`.
   * Allows elements to grow taller than the maximum if new content is added.
   * @default false
   */
  minHeight?: boolean;

  /**
   * Viewport width (px) below which harmonizing is disabled.
   * Set to 768 to let mobile layouts stack naturally.
   * @default 0 (always on)
   */
  breakpoint?: number;

  /**
   * Whether to auto-watch via ResizeObserver and MutationObserver.
   * Set to false for fire-and-forget manual mode.
   * @default true
   */
  watch?: boolean;

  /**
   * Apply a CSS `transition` on height changes for smooth animation.
   * @default true
   */
  transitions?: boolean;
}
```

---

### Instance Methods

#### `.refresh()` → `this`

Manually triggers a height re-calculation. Useful after CSS transitions finish or after content changes you explicitly control.

```javascript
const hh = heightHarmony('.card');
// ... some time later, after a font loads or animation finishes
hh.refresh();
```

#### `.destroy()` → `this`

Disconnects all ResizeObserver and MutationObserver instances, removes all inline `height` / `min-height` styles set by this instance, and marks it as destroyed.

```javascript
const hh = heightHarmony('.card');
// Clean up when a component unmounts (React, Vue, etc.)
hh.destroy();
```

---

### `heightHarmony.autoInit(options?)`

Scans the entire document for elements with `data-hh-group` attributes and harmonizes each group automatically.

```html
<!-- HTML -->
<div data-hh-group="cards">Card 1 — short content</div>
<div data-hh-group="cards">Card 2 — a lot more content here...</div>
<div data-hh-group="sidebar">Widget A</div>
<div data-hh-group="sidebar">Widget B</div>
```

```javascript
import heightHarmony from '@byronjohnson/height-harmony';

// One call handles all groups
const instances = heightHarmony.autoInit({ debounce: 100 });
// Returns an array of HeightHarmonyInstance, one per group
```

---

### `heightHarmony.version`

```javascript
console.log(heightHarmony.version); // "2.0.0"
```

---

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import heightHarmony from '@byronjohnson/height-harmony';

function CardGrid({ cards }) {
  useEffect(() => {
    const hh = heightHarmony('.card', { debounce: 50 });
    return () => hh.destroy();
  }, [cards]); // re-run when cards array changes

  return (
    <div className="grid">
      {cards.map(card => <div className="card" key={card.id}>{card.content}</div>)}
    </div>
  );
}
```

### Vue 3

```javascript
import { onMounted, onUnmounted, watch } from 'vue';
import heightHarmony from '@byronjohnson/height-harmony';

export function useHeightHarmony(selector, options = {}) {
  let instance = null;
  onMounted(() => { instance = heightHarmony(selector, options); });
  onUnmounted(() => { instance?.destroy(); });
  return { refresh: () => instance?.refresh() };
}
```

### Vanilla JS — DOMContentLoaded

```javascript
import heightHarmony from '@byronjohnson/height-harmony';

document.addEventListener('DOMContentLoaded', () => {
  heightHarmony('.card');          // ResizeObserver handles everything else
});
```

---

## How It Works

1. **Reset** — Clears inline `height` / `min-height` on all matched elements in a single write pass.
2. **Measure** — Reads `offsetHeight` for every element in one synchronous batch (no interleaved read/write thrashing).
3. **Apply** — Sets all elements to the maximum measured height.
4. **Watch** — `ResizeObserver` re-syncs automatically whenever any element's size changes. `MutationObserver` re-syncs when new elements are added to parent containers.

---

## Performance

Height Harmony v2 is carefully engineered to avoid common causes of layout thrashing:

- All height reads happen **before** any writes (batch read → batch write)
- `ResizeObserver` is far more efficient than `window.resize` — it only fires for elements that actually changed
- `requestAnimationFrame` ensures writes happen at the right point in the browser rendering pipeline
- A built-in debounce option prevents excessive recalculations during rapid mutations

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| ResizeObserver | 64+ | 69+ | 13.1+ | 79+ |
| MutationObserver | 26+ | 14+ | 7+ | 12+ |
| ES Modules | 61+ | 60+ | 10.1+ | 16+ |

For very old browsers, Height Harmony automatically falls back to a debounced `window.resize` listener.

---

## License

[MIT](LICENSE) © Byron Johnson
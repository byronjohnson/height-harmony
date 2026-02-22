/**
 * Height Harmony v2.0.0
 * The fastest, smartest equal-height JavaScript utility on the web.
 *
 * Automatically synchronizes element heights using ResizeObserver and
 * MutationObserver — no manual resize listeners needed.
 *
 * @author Byron Johnson
 * @license MIT
 * @see https://byronjohnson.github.io/height-harmony/demo/
 */

/**
 * @typedef {Object} HeightHarmonyOptions
 * @property {number}  [debounce=0]       - Milliseconds to debounce resize/mutation callbacks (0 = rAF only)
 * @property {boolean} [minHeight=false]  - Use min-height instead of height, allowing elements to grow taller
 * @property {number}  [breakpoint=0]     - Disable harmonizing below this viewport width (px); 0 = always on
 * @property {boolean} [watch=true]       - Auto-watch via ResizeObserver and MutationObserver
 * @property {boolean} [transitions=true] - Apply CSS transition on height changes for smooth animation
 */

const VERSION = '2.0.0';

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Creates a debounced version of fn that fires after `wait` ms of inactivity.
 * If wait === 0 we skip the timeout and only use requestAnimationFrame.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
function debounce(fn, wait) {
  let timer = null;
  return function debounced(...args) {
    if (timer !== null) clearTimeout(timer);
    if (wait > 0) {
      timer = setTimeout(() => {
        timer = null;
        requestAnimationFrame(() => fn.apply(this, args));
      }, wait);
    } else {
      requestAnimationFrame(() => fn.apply(this, args));
    }
  };
}

// ─── HeightHarmonyInstance ───────────────────────────────────────────────────

class HeightHarmonyInstance {
  /**
   * @param {string|NodeList|HTMLElement[]} target  CSS selector or element list
   * @param {HeightHarmonyOptions} options
   */
  constructor(target, options = {}) {
    this._target = target;
    this._opts = Object.assign(
      { debounce: 0, minHeight: false, breakpoint: 0, watch: true, transitions: true },
      options
    );

    this._destroyed = false;
    this._resizeObserver = null;
    this._mutationObserver = null;
    this._cleanupFallback = null;
    this._debouncedSync = debounce(this._sync.bind(this), this._opts.debounce);

    // Run immediately
    this._sync();

    // Set up observers if watching is enabled
    if (this._opts.watch) {
      this._setupObservers();
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Manually triggers a height re-calculation.
   * Useful after CSS transitions finish or after content changes you control.
   * @returns {this}
   */
  refresh() {
    if (this._destroyed) return this;
    this._sync();
    return this;
  }

  /**
   * Tears down all observers, removes inline height/transition styles set by
   * this instance, and marks the instance as destroyed.
   * @returns {this}
   */
  destroy() {
    if (this._destroyed) return this;
    this._destroyed = true;

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }

    // Clean up window event listeners added by the ResizeObserver fallback
    if (this._cleanupFallback) {
      this._cleanupFallback();
      this._cleanupFallback = null;
    }

    // Remove all inline styles we set
    const prop = this._opts.minHeight ? 'min-height' : 'height';
    this._getElements().forEach(el => {
      el.style.removeProperty(prop);
      el.style.removeProperty('box-sizing');
      if (this._opts.transitions) {
        el.style.removeProperty('transition');
      }
    });

    return this;
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  /**
   * Resolves the target into an array of HTMLElements.
   * @returns {HTMLElement[]}
   */
  _getElements() {
    if (typeof this._target === 'string') {
      return Array.from(document.querySelectorAll(this._target));
    }
    if (this._target instanceof NodeList || Array.isArray(this._target)) {
      return Array.from(this._target);
    }
    if (this._target instanceof HTMLElement) {
      return [this._target];
    }
    return [];
  }

  /**
   * Core synchronization routine.
   * Measures natural heights, finds the max, applies it to all elements.
   */
  _sync() {
    if (this._destroyed) return;

    const elements = this._getElements();
    if (elements.length === 0) return;

    // Check breakpoint — disable below threshold
    if (this._opts.breakpoint > 0 && window.innerWidth < this._opts.breakpoint) {
      const prop = this._opts.minHeight ? 'min-height' : 'height';
      elements.forEach(el => el.style.removeProperty(prop));
      return;
    }

    const prop = this._opts.minHeight ? 'min-height' : 'height';

    // Step 1: Strip current inline heights so we read natural layout heights
    elements.forEach(el => {
      el.style.setProperty(prop, '', 'important');
      // Ensure border-box so our offsetHeight read is reliable
      el.style.setProperty('box-sizing', 'border-box', 'important');
    });

    // Step 2: Force a synchronous layout read (single batch)
    // We use offsetHeight (includes padding/border, respects box model)
    let maxH = 0;
    elements.forEach(el => {
      const h = el.offsetHeight;
      if (h > maxH) maxH = h;
    });

    if (maxH === 0) return;

    // Step 3: Apply the max height to all elements
    elements.forEach(el => {
      if (this._opts.transitions) {
        el.style.setProperty('transition', `${prop} 0.2s ease`, '');
      }
      el.style.setProperty(prop, `${maxH}px`, 'important');
    });
  }

  /**
   * Sets up ResizeObserver to watch each element and MutationObserver to
   * watch the parent containers for new elements being added.
   */
  _setupObservers() {
    // ResizeObserver: re-sync whenever any observed element changes size
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(entries => {
        // Only fire if at least one entry has a real size change
        if (entries.length > 0) {
          this._debouncedSync();
        }
      });

      const observe = () => {
        this._getElements().forEach(el => this._resizeObserver.observe(el));
      };

      observe();
    } else {
      // Fallback for browsers without ResizeObserver (very old Safari, etc.)
      const handler = debounce(this._sync.bind(this), Math.max(this._opts.debounce, 150));
      const orientationHandler = () => setTimeout(() => this._sync(), 300);

      window.addEventListener('resize', handler, { passive: true });
      window.addEventListener('orientationchange', orientationHandler, { passive: true });

      // Store cleanup so destroy() can remove both listeners
      this._cleanupFallback = () => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('orientationchange', orientationHandler);
      };
    }

    // MutationObserver: re-sync when new children are added to parent containers
    if (typeof MutationObserver !== 'undefined') {
      const elements = this._getElements();
      const parents = new Set(elements.map(el => el.parentElement).filter(Boolean));

      if (parents.size > 0) {
        this._mutationObserver = new MutationObserver(mutations => {
          const hasNewNodes = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
          if (hasNewNodes) {
            this._debouncedSync();
            // Re-observe any new elements (ResizeObserver)
            if (this._resizeObserver) {
              this._getElements().forEach(el => {
                try { this._resizeObserver.observe(el); } catch (_) {}
              });
            }
          }
        });

        parents.forEach(parent => {
          this._mutationObserver.observe(parent, { childList: true, subtree: false });
        });
      }
    }
  }
}

// ─── Public factory function ──────────────────────────────────────────────────

/**
 * heightHarmony — equalizes the heights of all elements matching `target`.
 *
 * @param {string|NodeList|HTMLElement[]} target  - CSS selector or element collection
 * @param {HeightHarmonyOptions}          [opts]  - Configuration options
 * @returns {HeightHarmonyInstance}               - Instance with refresh() and destroy() methods
 *
 * @example
 * // Basic usage (same as v1)
 * heightHarmony('.card');
 *
 * @example
 * // With options
 * heightHarmony('.card', { debounce: 100, breakpoint: 768 });
 *
 * @example
 * // Store instance for later control
 * const hh = heightHarmony('.card');
 * hh.refresh();   // manual re-trigger
 * hh.destroy();   // clean up observers & styles
 */
function heightHarmony(target, opts) {
  return new HeightHarmonyInstance(target, opts);
}

// ─── Static metadata ──────────────────────────────────────────────────────────

heightHarmony.version = VERSION;

/**
 * Auto-initializes all elements with `data-hh-group` attributes.
 * Groups elements sharing the same data-hh-group value and harmonizes each group.
 *
 * Usage in HTML:
 *   <div data-hh-group="cards">...</div>
 *   <div data-hh-group="cards">...</div>
 *
 * @param {HeightHarmonyOptions} [opts] - Options applied to all groups
 * @returns {HeightHarmonyInstance[]}   - Array of instances, one per group
 */
heightHarmony.autoInit = function autoInit(opts = {}) {
  const all = document.querySelectorAll('[data-hh-group]');
  if (all.length === 0) return [];

  /** @type {Map<string, HTMLElement[]>} */
  const groups = new Map();
  all.forEach(el => {
    const key = el.getAttribute('data-hh-group');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });

  const instances = [];
  groups.forEach((elements) => {
    instances.push(new HeightHarmonyInstance(elements, opts));
  });
  return instances;
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export { HeightHarmonyInstance };
export default heightHarmony;
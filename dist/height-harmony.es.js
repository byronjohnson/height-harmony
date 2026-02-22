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
const VERSION = "2.0.0";
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
    this._debouncedSync = debounce(this._sync.bind(this), this._opts.debounce);
    this._sync();
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
   * Tears down all observers, removes inline height styles set by this instance,
   * and marks the instance as destroyed.
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
    const prop = this._opts.minHeight ? "min-height" : "height";
    this._getElements().forEach((el) => {
      el.style.removeProperty(prop);
      el.style.removeProperty("box-sizing");
    });
    return this;
  }
  // ── Private ─────────────────────────────────────────────────────────────────
  /**
   * Resolves the target into an array of HTMLElements.
   * @returns {HTMLElement[]}
   */
  _getElements() {
    if (typeof this._target === "string") {
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
    if (this._opts.breakpoint > 0 && window.innerWidth < this._opts.breakpoint) {
      const prop2 = this._opts.minHeight ? "min-height" : "height";
      elements.forEach((el) => el.style.removeProperty(prop2));
      return;
    }
    const prop = this._opts.minHeight ? "min-height" : "height";
    elements.forEach((el) => {
      el.style.setProperty(prop, "", "important");
      el.style.setProperty("box-sizing", "border-box", "important");
    });
    let maxH = 0;
    elements.map((el) => {
      const h = el.offsetHeight;
      if (h > maxH) maxH = h;
      return h;
    });
    if (maxH === 0) return;
    elements.forEach((el, i) => {
      if (parseInt(el.style.getPropertyValue(prop), 10) !== maxH) {
        if (this._opts.transitions) {
          el.style.setProperty("transition", `${prop} 0.2s ease`, "");
        }
        el.style.setProperty(prop, `${maxH}px`, "important");
      }
    });
  }
  /**
   * Sets up ResizeObserver to watch each element and MutationObserver to
   * watch the parent containers for new elements being added.
   */
  _setupObservers() {
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          this._debouncedSync();
        }
      });
      const observe = () => {
        this._getElements().forEach((el) => this._resizeObserver.observe(el));
      };
      observe();
    } else {
      const handler = debounce(this._sync.bind(this), Math.max(this._opts.debounce, 150));
      window.addEventListener("resize", handler, { passive: true });
      window.addEventListener("orientationchange", () => setTimeout(() => this._sync(), 300), { passive: true });
      this._cleanupFallback = () => {
        window.removeEventListener("resize", handler);
      };
    }
    if (typeof MutationObserver !== "undefined") {
      const elements = this._getElements();
      const parents = new Set(elements.map((el) => el.parentElement).filter(Boolean));
      if (parents.size > 0) {
        this._mutationObserver = new MutationObserver((mutations) => {
          const hasNewNodes = mutations.some((m) => m.addedNodes.length > 0 || m.removedNodes.length > 0);
          if (hasNewNodes) {
            this._debouncedSync();
            if (this._resizeObserver) {
              this._getElements().forEach((el) => {
                try {
                  this._resizeObserver.observe(el);
                } catch (_) {
                }
              });
            }
          }
        });
        parents.forEach((parent) => {
          this._mutationObserver.observe(parent, { childList: true, subtree: false });
        });
      }
    }
  }
}
function heightHarmony(target, opts) {
  return new HeightHarmonyInstance(target, opts);
}
heightHarmony.version = VERSION;
heightHarmony.autoInit = function autoInit(opts = {}) {
  const all = document.querySelectorAll("[data-hh-group]");
  if (all.length === 0) return [];
  const groups = /* @__PURE__ */ new Map();
  all.forEach((el) => {
    const key = el.getAttribute("data-hh-group");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  const instances = [];
  groups.forEach((elements) => {
    instances.push(new HeightHarmonyInstance(elements, opts));
  });
  return instances;
};
export {
  HeightHarmonyInstance,
  heightHarmony as default
};

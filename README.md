# Height Harmony

A lightweight, zero-dependency JavaScript utility for equalizing element heights.

## Live Demo

**[View the interactive demo →](https://byronjohnson.github.io/height-harmony/demo/)**

## Installation

```html
<script src="height-harmony.js"></script>
```

## Basic Usage

```javascript
// Apply equal heights to elements
heightHarmony('.card');
heightHarmony('.feature-box');
```

## Responsive Support

```javascript
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    heightHarmony('.card');
});

// Reapply on window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        heightHarmony('.card');
    }, 150);
});
```

## Dynamic Content

```javascript
// After adding new content
setTimeout(function() {
    heightHarmony('.product-card');
}, 10);
```

## How It Works

1. Resets all element heights to measure natural dimensions
2. Finds the tallest element in the group
3. Sets all elements to match the tallest height

## License

MIT
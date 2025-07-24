# Height Harmony

A lightweight, zero-dependency JavaScript utility for equalizing element heights.

## Overview

Height Harmony automatically sets all matching elements to the same height based on the tallest element in the group. This creates visually consistent layouts for cards, grids, and other UI components where content length varies.

## Installation

### Direct Include

```html
<script src="height-harmony.js"></script>
```

### NPM (coming soon)

```bash
npm install height-harmony
```

## Basic Usage

```javascript
// When the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Apply equal heights to elements with class 'card'
    heightHarmony('.card');
    
    // You can apply to multiple element groups
    heightHarmony('.feature-box');
    heightHarmony('.product-title');
});
```

## Responsive Design Support

For responsive layouts, you should recalculate heights when the window resizes:

```javascript
// Create a debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    // Clear any existing timeout
    clearTimeout(resizeTimeout);
    
    // Set a new timeout (debouncing)
    resizeTimeout = setTimeout(function() {
        heightHarmony('.card');
        heightHarmony('.feature-box');
    }, 500); // 500ms delay to avoid performance issues
});
```

## How It Works

Height Harmony uses a three-stage process:

1. **Reset**: First sets all element heights to 0px to clear any existing height styling
2. **Measure**: Restores natural heights and finds the tallest element
3. **Apply**: Sets all elements to the height of the tallest element

This approach ensures accurate height measurement even with complex CSS layouts.

## Advanced Usage

### Create a reusable initialization function:

```javascript
function initHeightHarmony() {
    // Apply to different element groups
    heightHarmony('.product-card');
    heightHarmony('.feature-box .title');
    heightHarmony('.team-member .bio');
}

// Initial setup
document.addEventListener('DOMContentLoaded', initHeightHarmony);

// Responsive handling
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initHeightHarmony, 500);
});
```

### With dynamic content:

```javascript
// After loading new content via AJAX
fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        // Update the DOM with new content
        updateProductList(data);
        
        // Re-apply height harmony
        heightHarmony('.product-card');
    });
```

## Browser Support

Height Harmony works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License
# Height Harmony

A lightweight, zero-dependency JavaScript utility for equalizing element heights.

## Live Demo

**[View the interactive demo →](https://byronjohnson.github.io/height-harmony/demo/)**

## Installation

### NPM
```bash
npm install height-harmony
```

```javascript
// ES6 Modules (recommended)
import heightHarmony from 'height-harmony';

// CommonJS
const heightHarmony = require('height-harmony');
```

### CDN

#### ES Modules (Modern Browsers)
```html
<script type="module">
    import heightHarmony from 'https://unpkg.com/height-harmony@latest/height-harmony.js';
    
    // Use immediately
    heightHarmony('.my-elements');
</script>
```

#### Traditional Script Tag
```html
<!-- Latest version -->
<script src="https://unpkg.com/height-harmony@latest/height-harmony-min.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/height-harmony@1.0.0/height-harmony-min.js"></script>
```

### Direct Download
```html
<!-- ES Modules -->
<script type="module" src="height-harmony.js"></script>

<!-- Traditional script tag -->
<script src="height-harmony-min.js"></script>
```

## Basic Usage

```javascript
// Apply equal heights to elements
heightHarmony('.card');
heightHarmony('.feature-box');
```

## Version Information

```javascript
// Check the current version
console.log(heightHarmony.version); // "1.0.0"
```

## ES Module Usage

### Browser ES Modules
```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import heightHarmony from './height-harmony.js';
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            heightHarmony('.card');
        });
        
        // Handle responsive behavior
        window.addEventListener('resize', function() {
            heightHarmony('.card');
        });
    </script>
</head>
<body>
    <div class="card">Content 1</div>
    <div class="card">Content 2</div>
    <div class="card">Content 3</div>
</body>
</html>
```

### Node.js / Build Tools
```javascript
// app.js
import heightHarmony from 'height-harmony';

// In your component
function initCards() {
    heightHarmony('.product-card');
}

// Export for use in other modules
export { initCards };
```

### Module Bundlers (Webpack, Rollup, etc.)
```javascript
// Works seamlessly with modern bundlers
import heightHarmony from 'height-harmony';

// Tree-shaking friendly
export function createCardGrid() {
    heightHarmony('.grid-item');
}
```

## Responsive Support

### ES Modules
```javascript
import heightHarmony from 'height-harmony';

document.addEventListener('DOMContentLoaded', function() {
    // Initial harmonization
    heightHarmony('.card');
    
    // Reapply on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            heightHarmony('.card');
        }, 150);
    });
    
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            heightHarmony('.card');
        }, 300);
    });
});
```

### Traditional Script Tag
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

### ES Modules
```javascript
import heightHarmony from 'height-harmony';

// After adding new content via AJAX/fetch
function addNewCards(data) {
    // Add new elements to DOM
    const container = document.getElementById('card-container');
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = item.content;
        container.appendChild(card);
    });
    
    // Harmonize heights after DOM update
    setTimeout(function() {
        heightHarmony('.card');
    }, 10);
}
```

### Traditional Approach
```javascript
// After adding new content
setTimeout(function() {
    heightHarmony('.product-card');
}, 10);
```

## Browser Compatibility

### ES Modules
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

### Traditional Script Tag
- All modern browsers
- IE 9+

## How It Works

1. Resets all element heights to measure natural dimensions
2. Finds the tallest element in the group
3. Sets all elements to match the tallest height

## License

MIT
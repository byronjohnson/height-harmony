/**
 * Sets all matching elements to the same height (the height of the tallest element)
 * @param {string} selector - CSS selector for the elements to harmonize
 */
function heightHarmony(selector) {
    // Get all matching elements
    const elements = document.querySelectorAll(selector);

    // Exit if no elements found
    if (elements.length === 0) return;

    // First pass: Reset all heights to 0px to clear any previous styling completely
    elements.forEach(element => {
        element.style.height = '0px';
    });

    // Use requestAnimationFrame for better browser synchronization
    requestAnimationFrame(() => {
        // Reset heights to auto to get natural heights
        let maxHeight = 0;

        // Find the maximum natural height
        elements.forEach(element => {
            // Reset to empty string to get natural height
            element.style.height = '';

            // Get the element's height
            const elementHeight = element.offsetHeight;

            // Update maxHeight if this element is taller
            maxHeight = Math.max(maxHeight, elementHeight);
        });

        // Set all elements to the maximum height
        elements.forEach(element => {
            element.style.height = maxHeight + 'px';
        });
    });
}

// Export the function as the default export
export default heightHarmony;
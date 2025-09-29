function heightHarmony(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.style.height = "0px";
  });
  requestAnimationFrame(() => {
    let maxHeight = 0;
    elements.forEach((element) => {
      element.style.height = "";
      const elementHeight = element.offsetHeight;
      maxHeight = Math.max(maxHeight, elementHeight);
    });
    elements.forEach((element) => {
      element.style.height = maxHeight + "px";
    });
  });
}
heightHarmony.version = "1.0.0";
export {
  heightHarmony as default
};

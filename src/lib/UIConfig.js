export function detectUIProperties(rulerNode) {
  const { width, height } = window.getComputedStyle(rulerNode);
  return {
    characterDimensions: [width, height].map(parseFloat)
  };
}

export default function UIConfig(opts) {
  this.update(opts);
}

UIConfig.prototype.update = function(opts) {
  Object.keys(opts).forEach((k) => {
    this[k] = opts[k];
  });
};

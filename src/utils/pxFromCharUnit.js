export function pxWidthFromCharUnit(uiConfig, value) {
  return uiConfig.characterDimensions[0] * value;
}

export function pxHeightFromCharUnit(uiConfig, value) {
  return uiConfig.characterDimensions[1] * value;
}

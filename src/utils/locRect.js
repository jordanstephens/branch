const BLOCK_TYPES = new Set(['BlockStatement', 'Program']);

export default function locRect(type, loc) {
  if (BLOCK_TYPES.has(type)) {
    return {
      x: 0,
      y: loc.start.line - 1,
      w: 80,
      h: Math.max(1, Math.abs(loc.end.line - loc.start.line + 1)),
    };
  }
  return {
    x: Math.min(loc.start.column, loc.end.column),
    y: loc.start.line - 1,
    w: Math.max(1, Math.abs(loc.end.column - loc.start.column)),
    h: Math.max(1, Math.abs(loc.end.line - loc.start.line + 1)),
  }
}

export default function locRect(loc) {
  return {
    x: Math.min(loc.start.column, loc.end.column),
    y: loc.start.line - 1,
    w: Math.max(1, Math.abs(loc.end.column - loc.start.column)),
    h: Math.max(1, Math.abs(loc.end.line - loc.start.line + 1)),
  }
}

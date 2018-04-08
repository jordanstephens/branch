
export function cursorFromPosition(position, astMap, uiConfig) {
  if (!position || !astMap || !uiConfig) {
    throw new Error('Cannot create cursor without Position, AstMap, and UIConfig');
  }
  const paths = astMap.find(position);
  if (!paths.length > 0) return null;
  return new Cursor(paths, uiConfig);
}

function CursorRectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.w = width;
  this.h = height;
}

export function cursorRectsFromLoc(loc, uiConfig) {
  const { start, end } = loc;
  const numLines = end.line - start.line + 1;

  if (numLines === 1) {
    return [
      new CursorRectangle(start.column, start.line - 1, end.column - start.column, 1)
    ];
  } else if (numLines === 2) {
    return [
      new CursorRectangle(start.column, start.line - 1, uiConfig.maxLineLength - start.column, 1),
      new CursorRectangle(0, end.line - 1, end.column, 1),
    ];
  } else {
    return [
      new CursorRectangle(start.column, start.line - 1, uiConfig.maxLineLength - start.column, 1),
      new CursorRectangle(0, start.line, uiConfig.maxLineLength, numLines - 2),
      new CursorRectangle(0, end.line - 1, end.column, 1),
    ];
  }
}

function bbox(rects) {
  return rects.reduce((memo, rect) => ({
    x: Math.min(memo.x, rect.x),
    y: Math.min(memo.y, rect.y),
    w: Math.max(memo.w, rect.w),
    h: memo.h + rect.h,
  }), { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, w: 0, h: 0 });
}

export default function Cursor(paths, uiConfig) {
  if (!paths || !paths.length) throw new Error('Invalid Cursor: empty paths');
  this.id = Math.random();
  this.paths = paths;
  this.rects = cursorRectsFromLoc(paths[0].node.loc, uiConfig);
  this.bbox = bbox(this.rects);
}

Cursor.prototype.equals = function(otherCursor) {
  return otherCursor && this.id === otherCursor.id;
}

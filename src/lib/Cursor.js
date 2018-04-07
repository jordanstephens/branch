
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

function lineRect(lineNumber, start, end) {
  return new CursorRectangle(start, lineNumber, end - start, 1);
}

export function cursorRectsFromLoc(loc, uiConfig) {
  const { start, end } = loc;
  const numLines = end.line - start.line + 1;

  return new Array(numLines).fill(0).map((_x, i) => {
    const lineNumber = start.line + i;
    const colStart = i === 0 ? start.column : 0;
    const colEnd = i === numLines - 1 ? end.column : uiConfig.maxLineLength;
    return lineRect(lineNumber - 1, colStart, colEnd);
  });
}

function unionRect(rects) {
  return rects.reduce((memo, rect) => ({
    x: Math.min(memo.x, rect.x),
    y: Math.max(memo.y, rect.y),
    w: Math.max(memo.w, rect.w),
    h: Math.max(memo.h, rect.h),
  }), { x: Number.POSITIVE_INFINITY, y: 0, w: 0, h: 0 });
}

export default function Cursor(paths, uiConfig) {
  if (!paths || !paths.length) throw new Error('Invalid Cursor: empty paths');
  this.id = Math.random();
  this.paths = paths;
  this.rects = cursorRectsFromLoc(paths[0].node.loc, uiConfig);
  this.bbox = unionRect(this.rects);
}

Cursor.prototype.equals = function(otherCursor) {
  return otherCursor && this.id === otherCursor.id;
}

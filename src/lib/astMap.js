import traverse from 'babel-traverse';
import RTree from 'rtree';

import { cursorRectsFromLoc } from './Cursor';

function AstMap(ast, uiConfig) {
  this.tree = new RTree();

  traverse(ast, {
    enter: (path) => {
      const depth = path.getAncestry().length;
      const rects = cursorRectsFromLoc(path.node.loc, uiConfig)

      rects.forEach((rect) => {
        this.tree.insert(rect, {
          path,
          depth,
        });
      });
    },
  });
}

AstMap.prototype.find = function find(position) {
  const { line, col } = position;
  const rect = { x: col, y: line, h: 1, w: 1 }

  return this.tree.search(rect)
    .sort((a, b) => b.depth - a.depth)
    .map(r => r.path);
};

export default AstMap;

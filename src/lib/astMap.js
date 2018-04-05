import traverse from 'babel-traverse';
import RTree from 'rtree';
import locRect from '../utils/locRect';

const MAX_COLUMN_WIDTH = 80;

function AstMap(ast) {
  this.tree = new RTree();

  traverse(ast, {
    enter: (path) => {
      const depth = path.getAncestry().length;
      const rect = locRect(path.type, path.node.loc)

      this.tree.insert(rect, {
        path,
        depth,
      });
    },
  });
}

AstMap.prototype.find = function find(line, col) {
  const rect = col
    ? { x: col, y: line, h: 1, w: 1 }
    : { x: 0, y: line, h: 1, w: MAX_COLUMN_WIDTH };

  return this.tree.search(rect)
    .sort((a, b) => b.depth - a.depth)
    .map(r => r.path);
};

export default AstMap;

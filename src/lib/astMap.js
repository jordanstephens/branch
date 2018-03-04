import { traverse as walk } from 'esprima-ast-utils';
import RTree from 'rtree';
import locRect from '../utils/locRect';

function AstMap(ast) {
  this.tree = new RTree();

  walk(ast, (node, parent, property, index, depth) => {
    const rect = locRect(node.loc);
    this.tree.insert(rect, {
      node,
      depth
    });
  });
}

AstMap.prototype.find = function find(line, col) {
  return this.tree.search({ x: col, y: line, h: 1, w: 1 })
    .sort((a, b) => b.depth - a.depth)
    .map(r => r.node);
};

export default AstMap;

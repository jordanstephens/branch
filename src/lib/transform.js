import traverse from 'babel-traverse';
import * as BabelTypes from 'babel-types';

export default function transform(type, path, opts = {}) {
  switch(type) {
    case 'RENAME_IDENTIFIER':
      path.scope.rename(path.node.name, opts.value)
      break;

    case 'CHANGE_NUMERICAL_LITERAL_VALUE':
      transform('REPLACE_NODE', path, {
        newNode: BabelTypes.numericLiteral(Number(opts.value)),
      });
      break;

    case 'CHANGE_STRING_LITERAL_VALUE':
      transform('REPLACE_NODE', path, {
        newNode: BabelTypes.stringLiteral(String(opts.value)),
      });
      break;

    case 'REPLACE_NODE':
      path.replaceWith(opts.newNode);
      break;

    case 'DELETE_NODE':
      let declarations = [];
      console.log(path);
      traverse(path.node, {
        VariableDeclarator: (path) => {
          declarations.push(path);
        }
      }, path.scope, null, path.parentPath);
      declarations.forEach((declaration) => {
        console.log(declaration, BabelTypes.isReferenced(declaration.node, declaration.parent));
      });
      path.remove();
      break;

    default:
      console.warn(`Transform undefined: ${type}`);
  }
}

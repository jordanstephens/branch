import * as Babylon from 'babylon';
import BabelGenerator from 'babel-generator';
import AstMap from './AstMap';

export function parse(str) {
  return Babylon.parse(str);
}

export function generate(ast, opts = {}) {
  return BabelGenerator(ast, opts).code;
}

export default function SourceCode(ast, uiConfig) {
  const code = generate(ast);
  this.ast = parse(code); // TODO: this may not be necessary. verify that locations are correct before removing
  this.astMap = new AstMap(this.ast, uiConfig);
  this.lines = code.split('\n');
  this.parsedAt = Date.now();
}

SourceCode.prototype.updateAstMap = function(uiConfig) {
  this.astMap = new AstMap(this.ast, uiConfig);
};

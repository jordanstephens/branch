import React, { Component } from 'react';
import * as Babylon from 'babylon';
import BabelGenerator from 'babel-generator';

import transform from './transform';
import AstMap from './lib/astMap';
import throttle from './utils/throttle';
import locRect from './utils/locRect';

import sample from './data/sample';

import 'react-virtualized/styles.css'
import './App.css';
import NodeTooltip from './NodeTooltip';
import EditorTextArea from './EditorTextArea';

const SIDEBAR_WIDTH = 32;
const GUTTER_WIDTH = 32;
const LINE_PADDING = 16;
const LEFT_PADDING = LINE_PADDING + GUTTER_WIDTH;

function tooltipDirection(target) {
  return target < (window.innerHeight / 2) ? 'up' : 'down';
}

function parse(str) {
  return Babylon.parse(str);
}

function generate(ast) {
  return BabelGenerator(ast, { }).code;
}

class App extends Component {
  constructor(props) {
    super(props);

    const messyAst = parse(sample);
    const code = generate(messyAst);
    const cleanAst = parse(code);
    const astMap = new AstMap(cleanAst)
    const lines = code.split('\n');

    this.state = {
      scrollTop: 0,
      active: [0, 0], // line, col
      focusPaths: [],
      ast: cleanAst,
      lines,
      astMap,
      characterDimensions: [8, 16], // width, height
      hoverRect: null,
      focusRect: null,
      modifiedAt: Date.now(),
    };
  }

  handleNodeChange = ({ type, path, opts }) => {
    transform(type, path, opts);

    const { ast } = this.state;
    const code = generate(ast);
    const newAst = parse(code);
    const astMap = new AstMap(newAst);
    const lines = code.split('\n');

    this.setState({
      ast: newAst,
      lines,
      astMap,
      focusPaths: [],
      focusRect: null,
      modifiedAt: Date.now(),
    });
  }

  componentDidMount() {
    this.list.addEventListener('mousemove', this.onMouseMove);
    const styles = window.getComputedStyle(this.ruler);
    this.setState({
      modifiedAt: Date.now(),
      characterDimensions: [
        parseFloat(styles.width),
        parseFloat(styles.height),
      ]
    });
  }

  componentWillUnMount() {
    this.list.removeEventListener('mousemove', this.onMouseMove);
  }

  mouseLineCol(event) {
    const { characterDimensions } = this.state;
    const line = Math.max(0, Math.floor(
      (this.state.scrollTop + event.clientY) / characterDimensions[1]
    ));
    const col = Math.max(0, Math.floor(
      (event.pageX - this.list.offsetLeft - LEFT_PADDING) / characterDimensions[0]
    ));

    return [line, col];
  }

  onMouseMove = (event) => {
    const { astMap } = this.state;
    const [line, col] = this.mouseLineCol(event);
    const paths = astMap.find(line, col);
    if (!paths.length > 0) return;
    const { type, node } = paths[0];
    const rect = locRect(type, node.loc);
    this.setState({
      active: [line, col],
      hoverRect: rect,
    });
  }

  onClick = (event) => {
    const { active, astMap } = this.state;
    const [ line, col ] = active;
    const paths = astMap.find(line, col);
    if (!paths.length > 0) return;
    const { type, node } = paths[0];
    const rect = locRect(type, node.loc);
    this.setState({
      focusPaths: paths,
      focusRect: rect,
    });
  }

  onScroll = throttle(({ scrollTop }) => {
    this.setState({
      scrollTop,
      hoverRect: null,
    });
  })

  charRectPx = (dimension, value) => {
    const { characterDimensions } = this.state;
    if (dimension === 'w') return characterDimensions[0] * value;
    if (dimension === 'h') return characterDimensions[1] * value;
  }

  rectTarget = (rect) => {
    const targetX = SIDEBAR_WIDTH + LEFT_PADDING
      + this.charRectPx('w', rect.x)
      + (0.5 * this.charRectPx('w', rect.w));
    const yPx = this.charRectPx('h', rect.y);
    const direction = tooltipDirection(yPx);
    const targetY = direction === 'up'
      ? yPx + this.charRectPx('h', rect.h)
      : yPx;

    return [ targetX, targetY ];
  }

  renderRect = ({ className, rect }) => (
    <div className={className} style={{
      position: 'absolute',
      left:   this.charRectPx('w', rect.x) + LEFT_PADDING,
      top:    this.charRectPx('h', rect.y) - this.state.scrollTop,
      width:  this.charRectPx('w', rect.w),
      height: this.charRectPx('h', rect.h),
    }} />
  )

  render() {
    const { characterDimensions, focusPaths, focusRect, hoverRect, lines, modifiedAt } = this.state;
    const focusPath = focusPaths[0];
    const nodeTooltipTarget = focusPath && this.rectTarget(focusRect);

    return (
      <div className="App">
        <aside className="App-sidebar">
          <h1 className="App-title">
            { /* Branch */ }
          </h1>
        </aside>
        <main
          className="App-main"
          ref={(el) => this.list = el}
          onClick={this.onClick}
        >
          <pre className="App-char-ruler" ref={(el) => this.ruler = el}>
            x
          </pre>
          {hoverRect && this.renderRect({ className: "App-hoverRect", rect: hoverRect })}
          {focusRect && this.renderRect({ className: "App-focusRect", rect: focusRect })}
          <EditorTextArea
            lines={lines}
            characterDimensions={characterDimensions}
            modifiedAt={modifiedAt}
            onScroll={this.onScroll}
          />
        </main>
        {focusPath ? (
          <NodeTooltip
            path={focusPath}
            target={nodeTooltipTarget}
            direction={tooltipDirection(nodeTooltipTarget[1])}
            onChange={this.handleNodeChange.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default App;

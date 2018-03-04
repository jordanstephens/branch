import React, { Component } from 'react';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import { List, AutoSizer } from 'react-virtualized';

import AstMap from './lib/astMap';
import throttle from './utils/throttle';
import locRect from './utils/locRect';

import sample from './data/sample';

import 'react-virtualized/styles.css'
import './App.css';
import NodeTooltip from './NodeTooltip';

const SIDEBAR_WIDTH = 32;
const GUTTER_WIDTH = 32;
const LINE_PADDING = 16;
const LEFT_PADDING = LINE_PADDING + GUTTER_WIDTH;

function tooltipDirection(target) {
  return target < (window.innerHeight / 2) ? 'up' : 'down';
}

class App extends Component {
  constructor(props) {
    super(props);

    const messyAst = esprima.parse(sample);
    const code = escodegen.generate(messyAst);
    const cleanAst = esprima.parse(code, {
      loc: true,
    });

    this.state = {
      scrollTop: 0,
      lines: code.split('\n'),
      active: [0, 0], // line, col
      focusNodes: [],
      ast: cleanAst,
      astMap: new AstMap(cleanAst),
      characterDimensions: [8, 16], // width, height
      hoverRect: null,
      focusRect: null,
    };
  }

  componentDidMount() {
    this.list.addEventListener('mousemove', this.onMouseMove);
    const styles = window.getComputedStyle(this.ruler);
    this.setState({
      characterDimensions: [
        parseFloat(styles.width),
        parseFloat(styles.height),
      ]
    });
  }

  componentWillUnMount() {
    this.list.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event) => {
    const { characterDimensions, astMap } = this.state;
    const line = Math.max(0, Math.floor((this.state.scrollTop + event.clientY) / characterDimensions[1]));
    const col = Math.max(0, Math.floor((event.pageX - this.list.offsetLeft - LEFT_PADDING) / characterDimensions[0]));
    const nodes = astMap.find(line, col);
    const rect = nodes.length ? locRect(nodes[0].loc) : null;
    this.setState({
      active: [line, col],
      hoverRect: rect,
    });
  }

  onClick = (event) => {
    const { active, astMap } = this.state;
    const [ line, col ] = active;
    const nodes = astMap.find(line, col);
    const rect = nodes.length ? locRect(nodes[0].loc) : null;
    this.setState({
      focusNodes: nodes,
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

  renderLine = ({ index, isScrolling, isVisible, key, style }) => {
    const { lines } = this.state;
    const line = lines[index];

    return (
      <div
        key={key}
        style={style}
        className="App-line"
      >
        <div className="App-lineNumber">{index}</div>
        <pre>{line}</pre>
      </div>
    )
  }

  render() {
    const { lines, characterDimensions, focusNodes, focusRect, hoverRect } = this.state;
    const focusNode = focusNodes[0];
    const nodeTooltipTarget = focusNode && this.rectTarget(focusRect);

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
          <AutoSizer>
            {({ width, height }) => (
              <List
                height={height}
                overscanRowCount={2}
                rowCount={lines.length}
                rowHeight={characterDimensions[1]}
                rowRenderer={this.renderLine.bind(this)}
                width={width}
                onScroll={this.onScroll}
              />
            )}
          </AutoSizer>
        </main>
        {focusNode ? (
          <NodeTooltip
            node={focusNode}
            target={nodeTooltipTarget}
            direction={tooltipDirection(nodeTooltipTarget[1])}
          />
        ) : null}
      </div>
    );
  }
}

export default App;

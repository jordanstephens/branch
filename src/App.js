import React, { Component } from 'react';

import transform from './lib/transform';
import UIConfig, { detectUIProperties } from './lib/UIConfig';
import { cursorFromPosition } from './lib/Cursor';
import Position from './lib/Position';
import SourceCode, { parse } from './lib/SourceCode';

import throttle from './utils/throttle';

import sample from './data/sample';

import CursorShape from './CursorShape';
import CursorTooltip from './CursorTooltip';
import EditorTextArea from './EditorTextArea';

import 'react-virtualized/styles.css'
import './App.css';

const SIDEBAR_WIDTH = 32;
const GUTTER_WIDTH = 32;
const LINE_PADDING = 16;
const MAX_LINE_LENGTH = 80;

class App extends Component {
  constructor(props) {
    super(props);

    const messyAst = parse(sample);
    const uiConfig = new UIConfig({
      characterDimensions: [8, 16], // width, height
      sidebarWidth: SIDEBAR_WIDTH,
      gutterWidth: GUTTER_WIDTH,
      linePadding: LINE_PADDING,
      leftPadding: LINE_PADDING + GUTTER_WIDTH,
      maxLineLength: MAX_LINE_LENGTH,
    });

    const sourceCode = new SourceCode(messyAst, uiConfig);

    this.state = {
      scrollTop: 0,
      uiConfig,
      sourceCode,
      hoverCursor: null,
      focusCursor: null,
    };
  }

  handleNodeChange = ({ type, path, opts }) => {
    transform(type, path, opts);

    const { sourceCode, uiConfig } = this.state;

    this.setState({
      sourceCode: new SourceCode(sourceCode.ast, uiConfig),
      focusCursor: null, // TODO: allow transform to set the next cursor
    });
  }

  componentDidMount() {
    this.list.addEventListener('mousemove', this.onMouseMove);
    let { uiConfig, sourceCode } = this.state;
    uiConfig.update(detectUIProperties(this.ruler));
    sourceCode.updateAstMap(uiConfig);

    this.setState({ uiConfig });
  }

  componentWillUnMount() {
    this.list.removeEventListener('mousemove', this.onMouseMove);
  }

  mousePosition(event) {
    const { pageX, clientY } = event;
    const { uiConfig, scrollTop } = this.state
    const [ charWidth, charHeight ] = uiConfig.characterDimensions;
    const line = Math.max(0, Math.floor((scrollTop + clientY) / charHeight));
    const col = Math.max(0, Math.floor((pageX - this.list.offsetLeft - uiConfig.leftPadding) / charWidth));
    return new Position(line, col);
  }

  onMouseMove = throttle((event) => {
    const { sourceCode, uiConfig } = this.state;
    const pointer = this.mousePosition(event);
    const hoverCursor = cursorFromPosition(pointer, sourceCode.astMap, uiConfig);
    this.setState({ hoverCursor });
  }, 30)

  onClick = (event) => {
    const { sourceCode, uiConfig } = this.state;
    const pointer = this.mousePosition(event);
    const focusCursor = cursorFromPosition(pointer, sourceCode.astMap, uiConfig);
    this.setState({ focusCursor });
  }

  onScroll = throttle(({ scrollTop }) => {
    this.setState({
      scrollTop,
      hoverRect: null,
    });
  })

  render() {
    const { uiConfig, sourceCode, scrollTop, hoverCursor, focusCursor } = this.state;

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
          <CursorShape
            cursor={hoverCursor}
            uiConfig={uiConfig}
            scrollTop={scrollTop}
            className='App-hoverCursor'
          />
          <CursorShape
            cursor={focusCursor}
            uiConfig={uiConfig}
            scrollTop={scrollTop}
            className='App-focusCursor'
          />
          <EditorTextArea
            sourceCode={sourceCode}
            rowHeight={uiConfig.characterDimensions[1]}
            onScroll={this.onScroll}
          />
        </main>
        <CursorTooltip
          cursor={focusCursor}
          uiConfig={uiConfig}
          onChange={this.handleNodeChange.bind(this)}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import sample from './data/sample';
import throttle from './utils/throttle';

import { List, AutoSizer } from 'react-virtualized';

import 'react-virtualized/styles.css'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const ast = esprima.parse(sample, {
      loc: true,
    });

    const code = escodegen.generate(ast);

    this.state = {
      lines: code.split('\n'),
      active: [0, 0],
      ast,
      characterDimensions: [8, 16],
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
    const { characterDimensions } = this.state;
    const line = Math.floor((this.state.scrollTop + event.clientY) / characterDimensions[1]);
    const leftPadding = 16;
    const col = Math.floor((event.pageX - this.list.offsetLeft - leftPadding) / characterDimensions[0]);
    this.setState({
      active: [line, col],
    });
  }

  renderLine = ({ index, isScrolling, isVisible, key, style }) => {
    const { lines, active } = this.state;
    const line = lines[index];

    return (
      <div
        key={key}
        style={style}
        className="App-line"
        data-active={active[0] === index}
      >
        <pre>{line}</pre>
      </div>
    )
  }

  render() {
    const { lines, characterDimensions } = this.state;
    return (
      <div className="App">
        <aside className="App-sidebar">
          <h1 className="App-title">{ /* Branch */ }</h1>
        </aside>
        <main className="App-main" ref={(el) => this.list = el}>
          <pre className="App-char-ruler" ref={(el) => this.ruler = el}>x</pre>
          <AutoSizer>
            {({ width, height }) => (
              <List
                height={height}
                overscanRowCount={2}
                rowCount={lines.length}
                rowHeight={characterDimensions[1]}
                rowRenderer={this.renderLine.bind(this)}
                width={width}
                onScroll={throttle(({ scrollTop }) => {
                  this.setState({
                    scrollTop,
                  });
                })}
              />
            )}
          </AutoSizer>
        </main>
      </div>
    );
  }
}

export default App;

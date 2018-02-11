import React, { Component } from 'react';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import sample from './data/sample';
import throttle from './utils/throttle';

import { List, AutoSizer } from 'react-virtualized';

import 'react-virtualized/styles.css'
import './App.css';

const LINE_HEIGHT = 16;

class App extends Component {
  constructor(props) {
    super(props);

    const ast = esprima.parse(sample, {
      loc: true,
    });

    const code = escodegen.generate(ast);

    this.state = {
      lines: code.split('\n'),
      ast,
    };
  }

  componentDidMount() {
    this.list.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnMount() {
    this.list.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event) => {
    console.log(Math.floor(event.pageX / 5));
    this.setState({
      activeLine: Math.floor((this.state.scrollTop + event.clientY) / LINE_HEIGHT),
    });
  }

  renderLine = ({ index, isScrolling, isVisible, key, style }) => {
    const { lines, activeLine } = this.state;
    const line = lines[index];

    return (
      <div
        key={key}
        style={style}
        className="App-line"
        data-active={activeLine === index}
      >
        <pre>{line}</pre>
      </div>
    )
  }

  render() {
    const { lines } = this.state;
    return (
      <div className="App">
        <aside className="App-sidebar">
          <h1 className="App-title">{ /* Branch */ }</h1>
        </aside>
        <main className="App-main" ref={(el) => this.list = el}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                height={height}
                overscanRowCount={2}
                rowCount={lines.length}
                rowHeight={LINE_HEIGHT}
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

import React, { Component } from 'react';
import { List, AutoSizer } from 'react-virtualized';

import './EditorTextArea.css';

class EditorTextArea extends Component {

  shouldComponentUpdate(nextProps) {
    return (nextProps.sourceCode.parsedAt !== this.props.sourceCode.parsedAt
      || nextProps.rowHeight !== this.props.rowHeight);
  }

  renderLine = ({ index, isScrolling, isVisible, key, style }) => {
    const { sourceCode } = this.props;
    const lineNumber = index + 1;
    const line = sourceCode.lines[index];

    return (
      <div
        key={key}
        style={style}
        className="App-line"
      >
        <div className="App-lineNumber">{lineNumber}</div>
        <pre>{line}</pre>
      </div>
    )
  }

  render() {
    const { rowHeight, sourceCode, onScroll } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            overscanRowCount={2}
            rowCount={sourceCode.lines.length}
            rowHeight={rowHeight}
            rowRenderer={this.renderLine.bind(this)}
            width={width}
            onScroll={onScroll}
          />
        )}
      </AutoSizer>
    );
  }
}

export default EditorTextArea;

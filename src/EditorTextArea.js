import React, { Component } from 'react';
import { List, AutoSizer } from 'react-virtualized';

import './EditorTextArea.css';

class EditorTextArea extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.modifiedAt !== this.props.modifiedAt;
  }

  renderLine = ({ index, isScrolling, isVisible, key, style }) => {
    const { lines } = this.props;
    const lineNumber = index + 1;
    const line = lines[index];

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
    const { characterDimensions, lines, onScroll } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            overscanRowCount={2}
            rowCount={lines.length}
            rowHeight={characterDimensions[1]}
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

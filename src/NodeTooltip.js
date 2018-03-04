import React, { Component } from 'react';

import './NodeTooltip.css';

class NodeTooltip extends Component {
  render() {
    const { node, target, direction } = this.props;

    if (!node) return null;

    return (
      <div
        className={`NodeTooltip-container NodeTooltip-${direction}`}
        style={{
          top: target[1],
          left: target[0],
        }}
      >
        <div
          className="NodeTooltip-content"
        >
          <strong>{node.type}</strong>
        </div>
      </div>
    );
  }
}

export default NodeTooltip;

import React, { Component } from 'react';

import './NodeTooltip.css';

import NodeInfo from './NodeInfo';

class NodeTooltip extends Component {
  render() {
    const { path, target, direction, onChange, onDelete } = this.props;

    if (!path) return null;

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
          <NodeInfo path={path} onChange={onChange} onDelete={onDelete} />
        </div>
      </div>
    );
  }
}

export default NodeTooltip;

import React, { Component } from 'react';

import './NodeInfo.css';

import IdentifierNodeInfo from './nodeInfo/IdentifierNodeInfo';
import NumericLiteralNodeInfo from './nodeInfo/NumericLiteralNodeInfo';
import StringLiteralNodeInfo from './nodeInfo/StringLiteralNodeInfo';

const componentMap = {
  Identifier: IdentifierNodeInfo,
  NumericLiteral: NumericLiteralNodeInfo,
  StringLiteral: StringLiteralNodeInfo,
};

class NodeInfo extends Component {
  onDelete = () => {
    this.props.onChange({
      type: 'DELETE_NODE',
      path: this.props.path,
      opts: {},
    });
  }

  render() {
    const { path, onChange } = this.props;
    const NodeInfoComponent = componentMap[path.node.type];

    return (
      <div className="NodeOptions">
        <strong>{path.node.type}</strong>
        {NodeInfoComponent ? (
          <NodeInfoComponent path={path} onChange={onChange} />
        ) : (
          <div>Unimplemented</div>
        )}
        <ul>
          <li>
            <button>Insert Before</button>
          </li>
          <li>
            <button>Insert After</button>
          </li>
          <li>
            <button>Wrap</button>
          </li>
          <li>
            <button onClick={this.onDelete}>
              Delete
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default NodeInfo;

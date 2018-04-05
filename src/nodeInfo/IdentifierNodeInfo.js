import React, { Component } from 'react';
import * as KEY_CODES from '../utils/keyCodes';

class IdentifierNodeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: {
        name: props.path.node.name,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { name } = nextProps.path.node;

    this.setState({
      node: { name },
    });
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      node: {
        ...this.state.node,
        [name]: value
      },
    });
  }

  handleKeyUp = (event) => {
    if (event.keyCode === KEY_CODES.RETURN) {
      this.handleCommit();
    }
  }

  handleCommit = (event) => {
    this.props.onChange({
      type: 'RENAME_IDENTIFIER',
      path: this.props.path,
      opts: { name: this.state.node.name },
    });
  }

  render() {
    const { name } = this.state.node;
    return (
      <div className="NodeInfo-Identifier">
        <label htmlFor='NodeInfo-Identifier-name'>Name</label>
        <input
          id='NodeInfo-Identifier-value'
          type='text'
          name='name'
          value={name}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
        />
        <button onClick={this.handleCommit}>Commit</button>
      </div>
    );
  }
}

export default IdentifierNodeInfo;

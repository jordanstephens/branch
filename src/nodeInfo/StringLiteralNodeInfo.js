import React, { Component } from 'react';
import * as KEY_CODES from '../utils/keyCodes';

class StringLiteralNodeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: {
        value: props.path.node.value,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps.path.node;

    this.setState({
      node: { value },
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

  handleCommit = () => {
    this.props.onChange({
      type: 'CHANGE_STRING_LITERAL_VALUE',
      path: this.props.path,
      opts: { value: this.state.node.value },
    });
  }

  render() {
    const { value } = this.state.node;
    return (
      <div className="NodeInfo-StringLiteral">
        <label htmlFor='NodeInfo-StringLiteral-value'>Value</label>
        <input
          id='NodeInfo-StringLiteral-value'
          type='text'
          name='value'
          value={value}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
        />
        <button onClick={this.handleCommit}>Commit</button>
      </div>
    );
  }
}

export default StringLiteralNodeInfo;
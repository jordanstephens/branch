import React, { Component } from 'react';

import KEY_CODES from '../../../constants/keyCodes';
import MODE from '../../../constants/modes';

import './InsertPanel.css';

const LITERAL_TRANSFORMS = {
  'NumericLiteral': 'CHANGE_NUMERICAL_LITERAL_VALUE',
  'StringLiteral': 'CHANGE_STRING_LITERAL_VALUE',
}

const TRANSFORM_TYPE = {
  [MODE.RENAME]: () => 'RENAME_IDENTIFIER',
  [MODE.CHANGE]: (type) => LITERAL_TRANSFORMS[type],
};

const INITIAL_VALUE = {
  [MODE.RENAME]: (path) => path.node.name,
  [MODE.CHANGE]: (path) => path.node.value,
};

class InsertPanel extends Component {
  constructor(props) {
    super(props);
    const { mode, path } = this.props;
    this.state = {
      value: INITIAL_VALUE[mode](path)
    };
    this.input = null;
  }

  componentDidMount() {
    this.input.focus();
    this.input.selectionStart = 0;
    this.input.selectionEnd = this.state.value.length;
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  onKeyUp = (event) => {
    if (event.keyCode === KEY_CODES.RETURN) {
      this.commitChange();
    }
  }

  onCommitClick = () => {
    this.commitChange();
  }

  onCancelClick = () => {
    this.props.onModeChange(MODE.NORMAL);
  }

  commitChange = () => {
    const { mode, path, onCommit } = this.props;
    const type = TRANSFORM_TYPE[mode](path.type);
    const opts = { value: this.state.value };
    onCommit({ type, path, opts });
  }

  render() {
    return (
      <div className='InsertPanel'>
        <input
          type='text'
          name='value'
          value={this.state.value}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          ref={(el) => this.input = el}
        />
        <button onClick={this.onCommitClick} className="InsertPanel-commit">✓</button>
        <button onClick={this.onCancelClick} className="InsertPanel-cancel">✗</button>
      </div>
    )
  }
}

export default InsertPanel;

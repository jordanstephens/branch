import React, { Component } from 'react';

import './CommandPanel.css';

const OPTIONS_LIST = ([
  { key: 'PREPEND', label: 'Prepend' },
  { key: 'REMOVE', label: 'Remove' },
  { key: 'APPEND', label: 'Append' },
  { key: 'WRAP', label: 'Wrap' },
  { key: 'RENAME', label: 'Rename' },
  { key: 'CHANGE', label: 'Change' },
  { key: 'CALL', label: 'Call' },
]);
// const OPTIONS = OPTIONS_LIST.reduce((m, i) => ({ ...m, [i.key]: i }), {});

function isLiteral(type) {
  return /Literal$/.test(type);
}

function isIdentifier(type) {
  return type === 'Identifier';
}

function optionVisible(key, path) {
  switch(key) {
    case 'RENAME':
      return !isLiteral(path.type);
    case 'CHANGE':
      return !isIdentifier(path.type) && isLiteral(path.type);
    default:
      return true;
  }
}

function optionEnabled(key, path) {
  switch(key) {
    case 'WRAP':
      return !/(Body|Method|[^Function]Declaration|Statement)$/.test(path.type);
    case 'REMOVE':
      return true;
    case 'CALL':
      return !/(Body|Method|[^Function]Declaration|Statement)$/.test(path.type);
    case 'PREPEND':
      return true;
    case 'RENAME':
      return isIdentifier(path.type);
    case 'CHANGE':
      return isLiteral(path.type);
    case 'APPEND':
      return true;
    default:
      return true;
  }
}

class CommandPanel extends Component {
  deleteNode = () => {
    const { path } = this.props;
    this.props.onCommit({
      type: 'DELETE_NODE',
      path,
      opts: {},
    });
  }

  onOptionClick = (key) => {
    if (key === 'REMOVE') {
      this.deleteNode();
    }
    this.props.onModeChange(key);
  }

  render() {
    const { path } = this.props;
    const options = OPTIONS_LIST.filter((option) => optionVisible(option.key, path));

    return (
      <div className="CommandPanel">
        <ul className="CommandPanel-list">
          {options.map((option) => (
            <li key={`option-${option.key}`} >
              <button
                onClick={() => this.onOptionClick(option.key)}
                disabled={!optionEnabled(option.key, path)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default CommandPanel;

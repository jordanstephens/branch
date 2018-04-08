import React, { Component } from 'react';

import CommandPanel from './panels/CommandPanel';
import InsertPanel from './panels/InsertPanel';

import * as pxUtils from '../../utils/pxFromCharUnit';
import MODE from '../../constants/modes';

import './CursorTooltip.css';

const { pxWidthFromCharUnit, pxHeightFromCharUnit } = pxUtils;

const TOOLTIP_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
};

function tooltipDirection(target) {
  return target < (window.innerHeight / 2) ? TOOLTIP_DIRECTION.UP : TOOLTIP_DIRECTION.DOWN;
}

function tooltipTarget(rect, uiConfig) {
  const targetX = uiConfig.sidebarWidth + uiConfig.leftPadding
    + pxWidthFromCharUnit(uiConfig, rect.x)
    + (0.5 * pxWidthFromCharUnit(uiConfig, rect.w));
  const topPx = pxHeightFromCharUnit(uiConfig, rect.y);
  const bottomPx = pxHeightFromCharUnit(uiConfig, rect.y + rect.h);
  const direction = tooltipDirection(topPx);
  const targetY = direction === TOOLTIP_DIRECTION.UP
    ? bottomPx
    : topPx;

  const target = [targetX, targetY];
  return {
    target,
    direction
  };
}

const MODE_PANEL = {
  [MODE.NORMAL]: CommandPanel,
  [MODE.RENAME]: InsertPanel,
  [MODE.CHANGE]: InsertPanel,
};

class CursorTooltip extends Component {
  shouldComponentUpdate(nextProps) {
    const { cursor, mode } = this.props;
    const { cursor: nextCursor, mode: nextMode } = nextProps;

    return !((cursor && cursor.equals(nextCursor)) && mode === nextMode);
  }

  render() {
    const { uiConfig, mode, cursor, onCommit, onModeChange } = this.props;

    if (!cursor) return null;

    const Panel = MODE_PANEL[mode];
    const { target, direction } = tooltipTarget(cursor.bbox, uiConfig);
    const path = cursor.paths[0];

    return (
      <div
        className={`CursorTooltip-container CursorTooltip-${direction}`}
        style={{
          top: target[1],
          left: target[0],
        }}
      >
        <div className="CursorTooltip-content">
          <Panel
            path={path}
            mode={mode}
            onCommit={onCommit}
            onModeChange={onModeChange}
          />
        </div>
      </div>
    );
  }
}

export default CursorTooltip;

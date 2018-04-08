import React, { Component } from 'react';

import NodeInfo from './NodeInfo';

import * as pxUtils from './utils/pxFromCharUnit';

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

class CursorTooltip extends Component {
  shouldComponentUpdate(nextProps) {
    const cursor = this.props.cursor;
    const nextCursor = nextProps.cursor;

    return !(cursor && cursor.equals(nextCursor));
  }

  render() {
    const { cursor, uiConfig, onChange, onDelete } = this.props;

    if (!cursor) return null;

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
        <div
          className="CursorTooltip-content"
        >
          <NodeInfo path={path} onChange={onChange} onDelete={onDelete} />
        </div>
      </div>
    );
  }
}

export default CursorTooltip;

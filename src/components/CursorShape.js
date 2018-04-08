import React from 'react';

import * as pxUtils from '../utils/pxFromCharUnit';

import './CursorShape.css';

const { pxWidthFromCharUnit, pxHeightFromCharUnit } = pxUtils;

export default ({ cursor, uiConfig, scrollTop, className }) => {
  if (!cursor) return null;
  const numRects = cursor.rects.length;

  return (
    <div className={className}>
      {cursor.rects.map((rect, i) => {
        const { maxLineLength } = uiConfig;
        const topLeftBlock = (
          i === 1 && rect.x === 0 && cursor.rects[0].x !== 0
        );
        const bottomRightBlock = (
          i === numRects - 2 && rect.w === maxLineLength && cursor.rects[i + 1].w !== maxLineLength
        );

        return (
          <div
            key={`cursor-shape-rect-${i}`}
            className='CursorShape-rect'
            data-top-left-block={topLeftBlock}
            data-bottom-right-block={bottomRightBlock}
            style={{
              position: 'absolute',
              left:   pxWidthFromCharUnit(uiConfig, rect.x) + uiConfig.leftPadding,
              top:    pxHeightFromCharUnit(uiConfig, rect.y) - scrollTop,
              width:  pxWidthFromCharUnit(uiConfig, rect.w),
              height: pxHeightFromCharUnit(uiConfig, rect.h),
            }}
          />
        );
      })}
    </div>
  );
};

import styled from 'styled-components';
import React from 'react';
export interface CommonStyle {
  [key: string]: React.CSSProperties;
}
export class StyleUtil {
  static hiddenText(maxSize: number) {
    return styled.p`
      white-space: nowrap;
      overflow: hidden;
      width: ${maxSize}em;
      text-overflow: ellipsis;
      margin: 0;
      :hover {
        overflow: visible;
        white-space: normal;
        overflow-wrap: break-word;
      }
    `;
  }

  static wordBreakText(maxSize: number) {
    return styled.p`
      width: ${maxSize}em;
      margin: 0;
      white-space: normal;
      overflow-wrap: break-word;
    `;
  }

  static commonStyle: CommonStyle = {
    flexFormCss: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    oneSpanFormItemCss: { width: '22em' },
    twoSpanFormItemCss: { width: '44em' },
  };
}

import React, { memo, useMemo } from 'react';

import styles from './style.module.scss';

interface HrDividerProps {
  height?: number;
  top?: number;
  bottom?: number;
}

const HrDivider: React.FC<HrDividerProps> = (props) => {
  const { height, top, bottom } = props;
  const heightStyle = useMemo(() => {
    if (top !== undefined || bottom !== undefined) {
      return {
        padding: `${top === undefined ? 0 : top}px 0 ${
          bottom === undefined ? 0 : bottom
        }px 0`,
      };
    }
    return { padding: `${height}px 0` };
  }, [bottom, top, height]);
  return (
    <div className={styles.container} style={heightStyle}>
      <div className={styles.line} />
    </div>
  );
};

HrDivider.defaultProps = {
  height: 20,
  top: undefined,
  bottom: undefined,
};

export default memo(HrDivider);

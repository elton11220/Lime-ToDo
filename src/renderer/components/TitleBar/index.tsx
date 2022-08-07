import type { FC } from 'react';
import useTitleBarAreaRect from 'renderer/hooks/useTitleBarAreaRect';

import styles from './style.module.scss';

interface TitleBarProps {
  title: string;
}

const TitleBar: FC<TitleBarProps> = (props) => {
  const { title } = props;
  const { height } = useTitleBarAreaRect();
  return (
    <>
      <div className={styles.container} style={{ height: `${height}px` }}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.placeholder} style={{ height: `${height}px` }} />
    </>
  );
};

export default TitleBar;

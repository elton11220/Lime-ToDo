import React, { useEffect, useState } from 'react';

import styles from './style.module.scss';

interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = (props) => {
  const { title } = props;
  const [sysTitleBarHeight, setSysTitleBarHeight] = useState(30);
  const updateTitleBarHeight = () => {
    const { height } =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.navigator.windowControlsOverlay.getTitlebarAreaRect(); // Chrome Experimental API & Chromium 98+ Only
    setSysTitleBarHeight(height); // Get the height of the window control area and uses it to dynamically adjust the height of the window title bar
  };
  useEffect(() => {
    updateTitleBarHeight();
    const windowMaximumChangeHandler = window.electron.ipcRenderer.on(
      'windowMaximumChange',
      updateTitleBarHeight
    );
    return () => {
      windowMaximumChangeHandler?.();
    };
  }, []);
  return (
    <div
      className={styles.container}
      style={{ height: `${sysTitleBarHeight}px` }}
    >
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default TitleBar;

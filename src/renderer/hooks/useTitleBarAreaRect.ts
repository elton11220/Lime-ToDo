import { useEffect, useState } from 'react';

interface TitleBarAreaRect {
  x?: number | undefined;
  y?: number | undefined;
  height?: number | undefined;
  width?: number | undefined;
  left?: number | undefined;
  right?: number | undefined;
  top?: number | undefined;
  bottom?: number | undefined;
}

export default function useTitleBarAreaRect(): TitleBarAreaRect {
  const [domRect, setDomRect] = useState<TitleBarAreaRect>({
    x: 0,
    y: 0,
    height: 29,
    width: 1280,
    left: 0,
    right: 1280,
    top: 0,
    bottom: 29,
  });
  const updateDomRect = () => {
    const data =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.navigator.windowControlsOverlay.getTitlebarAreaRect(); // Chrome Experimental API & Chromium 98+ Only. It queries the current geometry of the title bar area of the Progressive Web App window.
    setDomRect(data);
  };
  useEffect(() => {
    updateDomRect();
    const windowMaximumChangeHandler = window.electron.ipcRenderer.on(
      'windowMaximumChange',
      updateDomRect
    );
    return () => {
      windowMaximumChangeHandler?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return domRect;
}

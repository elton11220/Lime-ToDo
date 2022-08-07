import { ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import { useEffect } from 'react';

export default function useIpcRendererListener(
  channel: string,
  func: (...args: unknown[]) => void
) {
  useEffect(() => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  }, [channel, func]);
}

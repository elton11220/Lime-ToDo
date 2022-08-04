import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[] | unknown): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      minimize: () => void;
      maximize: () => void;
      unmaximize: () => void;
      close: () => void;
    };
  }
  interface ListItem {
    id: string;
    title: string;
    folder: boolean;
    parent: string;
    color: number;
    order: number;
  }
  interface TagItem {
    id: string;
    title: string;
    color: number;
    order: number;
  }
  interface RenderListItem {
    id: string;
    title: string;
    folder: false;
    color: number;
    order: number;
  }
  interface RenderListItemFolder {
    id: string;
    title: string;
    folder: true;
    children: Array<RenderListItem>;
    order: number;
  }
  interface TodoStep {
    id: string;
    finish: boolean;
    title: string;
    order: number;
  }
  interface TodoItem {
    id: string;
    parent: string;
    order: number;
    finish: boolean;
    priority: number;
    data: {
      title: string;
      note: string;
      steps: TodoStep[];
      tags: string[];
      location: string;
      remind_at: string;
      end_at: string;
    };
  }
}

export {};

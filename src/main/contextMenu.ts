import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

interface ActionListenerOptions {
  itemType: string;
  itemID: string;
}

export default class ContextMenuBuilder {
  actionListener(event: IpcMainEvent, options: ActionListenerOptions): void {
    const { itemType, itemID } = options;
    if (itemType === 'tagItem') {
      const menu = Menu.buildFromTemplate(
        this.buildTagItemTemplate(event, itemID)
      );
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender) as BrowserWindow,
      });
    } else if (itemType === 'toDoMenuItem') {
      const menu = Menu.buildFromTemplate(
        this.buildToDoMenuItemTemplate(event, itemID)
      );
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender) as BrowserWindow,
      });
    }
  }

  initialize() {
    ipcMain.on('show-context-menu', this.actionListener.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  buildToDoMenuItemTemplate(event: IpcMainEvent, itemID: string) {
    const template = [
      {
        label: '编辑',
        click: () => {
          event.reply('edit-toDoMenuItem-menu', itemID);
        },
      },
      {
        label: '删除',
        click: () => {
          event.reply('delete-toDoMenuItem-menu', itemID);
        },
      },
    ];
    return template;
  }

  // eslint-disable-next-line class-methods-use-this
  buildTagItemTemplate(event: IpcMainEvent, itemID: string) {
    const template = [
      {
        label: '编辑',
        click: () => {
          event.reply('edit-tagItem-menu', itemID);
        },
      },
      {
        label: '删除',
        click: () => {
          event.reply('delete-tagItem-menu', itemID);
        },
      },
    ];
    return template;
  }
}

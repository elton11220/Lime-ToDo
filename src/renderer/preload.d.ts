import { TodoItemPriority } from './utils/itemUtils';

declare global {
  interface Item {
    id: string;
    order: number;
  }
  interface ListItem extends Item {
    title: string;
    folder: boolean;
    parent: string;
    color: number;
  }
  interface TagItem extends Item {
    title: string;
    color: number;
  }
  interface RenderListItem extends Item {
    title: string;
    folder: false;
    color: number;
  }
  interface RenderListItemFolder extends Item {
    title: string;
    folder: true;
    children: Array<RenderListItem>;
  }
  interface TodoStep extends Item {
    finish: boolean;
    title: string;
  }
  interface TodoItem extends Item {
    parent: string;
    finish: boolean;
    priority: TodoItemPriority;
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

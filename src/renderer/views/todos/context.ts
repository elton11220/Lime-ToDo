import { createContext } from 'react';
import HashMap from 'utils/HashMap';
import { SortedLinkedList } from 'utils/LinkedList';

interface TodoContextType {
  todoMenuTitles: Map<string, string>;
  todoMenuMap: Map<string, ListItem>;
  tagMap: Map<string, TagItem>;
  tagTitles: Map<string, string>;
  listTitles: Map<string, string>;
  active: string;
  todoItemsMap: HashMap<SortedLinkedList<TodoItem>>;
  colors: string[];
}

const TodoContext = createContext<TodoContextType>({
  todoMenuTitles: new Map(),
  todoMenuMap: new Map(),
  tagMap: new Map(),
  tagTitles: new Map(),
  listTitles: new Map(),
  active: 'collection',
  todoItemsMap: new HashMap<SortedLinkedList<TodoItem>>(),
  colors: [],
});

TodoContext.displayName = 'TodoContext';

export default TodoContext;

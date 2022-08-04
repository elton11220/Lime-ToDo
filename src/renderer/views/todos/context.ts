import { createContext } from 'react';

interface TodoContextType {
  todoMenuTitles: Map<string, string>;
  tagTitles: Map<string, string>;
  listTitles: Map<string, string>;
  active: string;
}

const TodoContext = createContext<TodoContextType>({
  todoMenuTitles: new Map(),
  tagTitles: new Map(),
  listTitles: new Map(),
  active: 'collection',
});

export default TodoContext;

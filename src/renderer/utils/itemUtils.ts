import HashMap from 'utils/HashMap';
import { Compare, SortedLinkedList } from 'utils/LinkedList';

const orderFn: (a: TodoItem, b: TodoItem) => Compare = (a, b) => {
  if (a.order === b.order) {
    return Compare.EQUAL;
  }
  return a.order < b.order ? Compare.LESS_THAN : Compare.BIGGER_THAN;
};

const getTodoItemsMap: (
  todos: TodoItem[]
) => HashMap<SortedLinkedList<TodoItem>> = (todos) => {
  const hashMap = new HashMap<SortedLinkedList<TodoItem>>();
  todos.forEach((val: TodoItem) => {
    if (hashMap.has(val.parent)) {
      const linkedList = hashMap.get(val.parent) as SortedLinkedList<TodoItem>;
      linkedList.insert(val);
    } else {
      hashMap.put(val.parent, new SortedLinkedList<TodoItem>(orderFn));
    }
  });
  return hashMap;
};

// eslint-disable-next-line import/prefer-default-export
export { getTodoItemsMap };

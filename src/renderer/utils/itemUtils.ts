import HashMap from 'utils/HashMap';
import { Compare, SortedLinkedList } from 'utils/LinkedList';

const orderFn: (a: TodoItem, b: TodoItem) => Compare = (a, b) => {
  if (a.order === b.order) {
    return Compare.EQUAL;
  }
  return a.order < b.order ? Compare.LESS_THAN : Compare.BIGGER_THAN;
};

const getTodoItemsMap: (
  todoItems: TodoItem[]
) => HashMap<SortedLinkedList<TodoItem>> = (todoItems) => {
  const hashMap = new HashMap<SortedLinkedList<TodoItem>>();
  todoItems.forEach((val: TodoItem) => {
    if (hashMap.has(val.parent)) {
      const linkedList = hashMap.get(val.parent) as SortedLinkedList<TodoItem>;
      linkedList.insert(val);
    } else {
      const newLinkedList = new SortedLinkedList<TodoItem>(orderFn);
      newLinkedList.insert(val);
      hashMap.put(val.parent, newLinkedList);
    }
  });
  return hashMap;
};

enum TodoItemPriority {
  none = 0,
  low = 1,
  medium = 2,
  high = 3,
}

export { getTodoItemsMap, TodoItemPriority };

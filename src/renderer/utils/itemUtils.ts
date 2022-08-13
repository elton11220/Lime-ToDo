import HashMap from 'utils/HashMap';
import { Compare, SortedLinkedList } from 'utils/LinkedList';

const orderFn: (a: TodoItem, b: TodoItem) => Compare = (a, b) => {
  if (a.order === b.order) {
    return Compare.EQUAL;
  }
  return a.order < b.order ? Compare.LESS_THAN : Compare.BIGGER_THAN;
};

const getTodoItemsMap: (todoItems: TodoItem[]) => {
  itemsMap: HashMap<SortedLinkedList<TodoItem>>;
  tagCountMap: Map<string, number>;
} = (todoItems) => {
  const itemsMap = new HashMap<SortedLinkedList<TodoItem>>();
  const tagCountMap = new Map<string, number>();
  todoItems.forEach((val: TodoItem) => {
    if (itemsMap.has(val.parent)) {
      const linkedList = itemsMap.get(val.parent) as SortedLinkedList<TodoItem>;
      linkedList.insert(val);
    } else {
      const newLinkedList = new SortedLinkedList<TodoItem>(orderFn);
      newLinkedList.insert(val);
      itemsMap.put(val.parent, newLinkedList);
    }
    val.data.tags.forEach((tagId: string) => {
      const previousCount = tagCountMap.get(tagId);
      if (typeof previousCount === 'number') {
        tagCountMap.set(tagId, previousCount + 1);
      } else {
        tagCountMap.set(tagId, 1);
      }
    });
  });
  return {
    itemsMap,
    tagCountMap,
  };
};

enum TodoItemPriority {
  none = 0,
  low = 1,
  medium = 2,
  high = 3,
}

export { getTodoItemsMap, TodoItemPriority };

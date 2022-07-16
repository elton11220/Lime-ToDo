const getSortedRootItemIndexes: (
  todoMenu: ListItem[],
  data: number[]
) => number[] = (todoMenu: ListItem[], data: number[]) =>
  data.sort((a, b) => todoMenu[a].order - todoMenu[b].order);

const getSortedSubItemIndexes: (
  todoMenu: ListItem[],
  data: Map<string, number[]>
) => Map<string, number[]> = (
  todoMenu: ListItem[],
  data: Map<string, number[]>
) => {
  const temp = new Map<string, number[]>();
  data.forEach((value, key) => {
    temp.set(
      key,
      value.sort((a, b) => todoMenu[a].order - todoMenu[b].order)
    );
  });
  return temp;
};

// Convert the raw data of the sidebar to a tree structure for rendering
const flatToTree: (data: ListItem[]) => {
  tree: Array<RenderListItem | RenderListItemFolder>;
  sortedTree: Array<RenderListItem | RenderListItemFolder>;
  realRootItemIndexes: number[];
  realSubItemIndexes: Map<string, number[]>;
} = (data: ListItem[]) => {
  const folderIndexes = new Map<string, number>(); // Use RBTree to improve query speed
  const realRootItemIndexes: number[] = [];
  const realSubItemIndexes = new Map<string, number[]>(); // key: folder.id value: subitem.id[]
  const folders: Array<RenderListItemFolder> = [];
  const handledItems: Array<RenderListItem> = [];
  const unhandledItems: Array<ListItem> = [];
  data.forEach((value: ListItem, index: number) => {
    // Handle folder items and non sub item first
    if (value.folder) {
      // When the current item is a folder
      folderIndexes.set(value.id, folders.length);
      realSubItemIndexes.set(value.id, []);
      realRootItemIndexes.push(index);
      folders.push({
        id: value.id,
        title: value.title,
        folder: true,
        children: [],
        order: value.order,
      });
    } else if (value.parent === '') {
      // When the current item is not a folder and is not a sub item
      handledItems.push({
        id: value.id,
        title: value.title,
        color: value.color,
        folder: false,
        order: value.order,
      });
      realRootItemIndexes.push(index);
    } else {
      // When the current item is not a folder and is a sub item
      const currentIndexes = realSubItemIndexes.get(value.parent) as number[];
      currentIndexes.push(index);
      realSubItemIndexes.set(value.parent, currentIndexes);
      unhandledItems.push({
        id: value.id,
        title: value.title,
        folder: false,
        parent: value.parent,
        color: value.color,
        order: value.order,
      });
    }
  });
  unhandledItems.forEach((value: ListItem) => {
    // Handle sub items
    const index = folderIndexes.get(value.parent);
    if (typeof index === 'number') {
      folders[index].children.push({
        id: value.id,
        title: value.title,
        color: value.color,
        folder: false,
        order: value.order,
      });
    }
  });
  const sortedFolders = folders.map((folder) => ({
    ...folder,
    children: [...folder.children].sort((a, b) => a.order - b.order),
  }));
  const sortedTree = [...sortedFolders, ...handledItems].sort(
    (a, b) => a.order - b.order
  );
  return {
    tree: [...folders, ...handledItems],
    sortedTree,
    realRootItemIndexes: getSortedRootItemIndexes(data, realRootItemIndexes),
    realSubItemIndexes: getSortedSubItemIndexes(data, realSubItemIndexes),
  };
};

const getNextOrder: {
  (data: Array<RenderListItem | RenderListItemFolder>, parent: string): number;
  (data: Array<TagItem>): number;
} = (
  data: Array<RenderListItem | RenderListItemFolder | TagItem>,
  parent = ''
) => {
  if (data.length && Object.prototype.hasOwnProperty.call(data[0], 'folder')) {
    if (parent === '') {
      return data.length;
    }
    return (
      (data as (RenderListItem | RenderListItemFolder)[]).find(
        (item: RenderListItem | RenderListItemFolder) => item.id === parent
      ) as RenderListItemFolder
    ).children.length;
  }
  return data.length;
};

export {
  flatToTree,
  getNextOrder,
  getSortedRootItemIndexes,
  getSortedSubItemIndexes,
};

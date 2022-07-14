// Convert the raw data of the sidebar to a tree structure for rendering
const flatToTree: (
  data: ListItem[]
) => Array<RenderListItem | RenderListItemFolder> = (data: ListItem[]) => {
  const folderIndexes = new Map<string, number>(); // Use RBTree to improve query speed
  const folders: Array<RenderListItemFolder> = [];
  const handledItems: Array<RenderListItem> = [];
  const unhandledItems: Array<ListItem> = [];
  data.forEach((value: ListItem) => {
    // Handle folder items and non sub item first
    if (value.folder) {
      // When the current item is a folder
      folderIndexes.set(value.id, folders.length);
      folders.push({
        id: value.id,
        title: value.title,
        folder: true,
        children: [],
      });
    } else if (value.parent === '') {
      // When the current item is not a folder and is not a sub item
      handledItems.push({
        id: value.id,
        title: value.title,
        color: value.color,
        folder: false,
      });
    } else {
      // When the current item is not a folder and is a sub item
      unhandledItems.push({
        id: value.id,
        title: value.title,
        folder: false,
        parent: value.parent,
        color: value.color,
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
      });
    }
  });
  return [...folders, ...handledItems];
};

export { flatToTree };

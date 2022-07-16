import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const namespace = 'dataReducer';

interface InitialState {
  todoMenu: ListItem[];
  tags: TagItem[];
  colors: string[];
}

const initialState: InitialState = {
  colors: [
    // eslint-disable-next-line prettier/prettier
    '#deefb7', '#98dfaf', '#5fb49c', '#414288', '#682d63',
    // eslint-disable-next-line prettier/prettier
    '#fe9c8f', '#feb2a8', '#fec8c1', '#fad9c1', '#f9caa7',
    // eslint-disable-next-line prettier/prettier
    '#91e5f6', '#84d2f6', '#59a5d8', '#386fa4', '#133c55',
    // eslint-disable-next-line prettier/prettier
    '#fdc921', '#fdd85d', '#f76c5e', '#99d6ea', '#6798c0',
    // eslint-disable-next-line prettier/prettier
    '#ffdde1', '#ffb8de', '#ff74d4', '#ff36ab', '#642ca9',
    // eslint-disable-next-line prettier/prettier
    '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9', '#ff99c8',
    // eslint-disable-next-line prettier/prettier
    '#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d',
    // eslint-disable-next-line prettier/prettier
    '#dad873', '#8cffda', '#ffb2e6', '#d972ff',
  ],
  todoMenu: [],
  tags: [],
};

const dataReducer = createSlice({
  name: namespace,
  initialState,
  reducers: {
    deleteTag(state, action: PayloadAction<string>) {
      const idx = state.tags.findIndex((item) => item.id === action.payload);
      state.tags.splice(idx, 1);
      for (let i = idx; i < state.tags.length; i += 1) {
        state.tags[i].order = i;
      }
    },
    addTag(state, action: PayloadAction<TagItem>) {
      state.tags.push(action.payload);
    },
    editTag(state, action: PayloadAction<TagItem>) {
      const idx = state.tags.findIndex((item) => item.id === action.payload.id);
      state.tags[idx] = action.payload;
    },
    addTodoMenu(state, action: PayloadAction<ListItem>) {
      state.todoMenu.push(action.payload);
    },
    deleteTodoMenu(
      state,
      action: PayloadAction<{
        itemId: string;
        realItemIndexes: number[];
      }>
    ) {
      const idx = state.todoMenu.findIndex(
        (item: ListItem) => item.id === action.payload.itemId
      );
      const workingIndex = action.payload.realItemIndexes.findIndex(
        (item) => item === idx
      );
      for (
        let i = workingIndex + 1;
        i < action.payload.realItemIndexes.length;
        i += 1
      ) {
        state.todoMenu[action.payload.realItemIndexes[i]].order -= 1;
      }
      state.todoMenu.splice(idx, 1);
    },
    editTodoMenu(
      state,
      action: PayloadAction<{
        listItem: ListItem;
        realRootItemIndexes: number[];
        realSubItemIndexes: number[];
      }>
    ) {
      const idx = state.todoMenu.findIndex(
        (item) => item.id === action.payload.listItem.id
      );
      if (action.payload.listItem.folder) {
        // The current method is used to edit folders and edit items. Skip order adjustment when editing a folder
        state.todoMenu[idx] = action.payload.listItem;
        return;
      }
      if (state.todoMenu[idx].parent !== action.payload.listItem.parent) {
        // The parent directory has changed. Adjust the order
        if (action.payload.listItem.parent === '') {
          const workingIndex = action.payload.realSubItemIndexes.findIndex(
            (item) => item === idx
          );
          for (
            let i = workingIndex + 1;
            i < action.payload.realSubItemIndexes.length;
            i += 1
          ) {
            state.todoMenu[action.payload.realSubItemIndexes[i]].order -= 1;
          }
        } else {
          const workingIndex = action.payload.realRootItemIndexes.findIndex(
            (item) => item === idx
          );
          for (
            let i = workingIndex + 1;
            i < action.payload.realRootItemIndexes.length;
            i += 1
          ) {
            state.todoMenu[action.payload.realRootItemIndexes[i]].order -= 1;
          }
        }
      }
      state.todoMenu[idx] = action.payload.listItem;
    },
    addTodoMenuFolder(state, action: PayloadAction<ListItem>) {
      state.todoMenu.push(action.payload);
    },
    breakTodoMenuFolder(
      state,
      action: PayloadAction<{
        itemId: string;
        realSubItemIndexes: number[];
        realRootItemIndexes: number[];
      }>
    ) {
      const index = state.todoMenu.findIndex(
        (item) => item.id === action.payload.itemId
      );
      const workingIndex = action.payload.realRootItemIndexes.findIndex(
        (item) => item === index
      );
      for (
        let i = workingIndex + 1;
        i < action.payload.realRootItemIndexes.length;
        i += 1
      ) {
        state.todoMenu[action.payload.realRootItemIndexes[i]].order -= 1;
      }
      action.payload.realSubItemIndexes.forEach((val, idx) => {
        state.todoMenu[val] = {
          ...state.todoMenu[val],
          folder: false,
          parent: '',
          order: action.payload.realRootItemIndexes.length + idx - 1,
        };
      });
      state.todoMenu.splice(index, 1);
    },
  },
});

export default dataReducer.reducer;
export const {
  deleteTag,
  addTag,
  editTag,
  addTodoMenu,
  editTodoMenu,
  deleteTodoMenu,
  breakTodoMenuFolder,
  addTodoMenuFolder,
} = dataReducer.actions;

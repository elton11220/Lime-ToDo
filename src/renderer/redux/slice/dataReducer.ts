import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import db from 'renderer/utils/db';

const namespace = 'dataReducer';

interface InitialState {
  todoMenu: ListItem[];
  tags: TagItem[];
  colors: string[];
  todos: TodoItem[];
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
  todos: [],
};

const dataReducer = createSlice({
  name: namespace,
  initialState,
  reducers: {
    deleteTag(state, action: PayloadAction<string>) {
      const idx = state.tags.findIndex((item) => item.id === action.payload);
      db.tag.update(
        { order: { $gt: state.tags[idx].order } },
        { $set: { order: (val: number) => val - 1 } },
        { multi: true }
      );
      db.tag.remove({ id: state.tags[idx].id });
      state.tags.splice(idx, 1);
      for (let i = idx; i < state.tags.length; i += 1) {
        state.tags[i].order = i;
      }
    },
    addTag(state, action: PayloadAction<TagItem>) {
      db.tag.insert(action.payload);
      state.tags.push(action.payload);
    },
    editTag(state, action: PayloadAction<TagItem>) {
      const idx = state.tags.findIndex((item) => item.id === action.payload.id);
      db.tag.update({ id: state.tags[idx].id }, action.payload);
      state.tags[idx] = action.payload;
    },
    addTodoMenu(state, action: PayloadAction<ListItem>) {
      db.todoMenu.insert(action.payload);
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
      db.todoMenu.update(
        {
          parent: state.todoMenu[idx].parent,
          order: { $gt: state.todoMenu[idx].order },
        },
        {
          $set: { order: (val: number) => val - 1 },
        },
        {
          multi: true,
        }
      );
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
        db.todoMenu.update(
          { id: action.payload.listItem.id },
          action.payload.listItem
        );
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
          db.todoMenu.update(
            {
              parent: state.todoMenu[idx].parent,
              order: { $gt: state.todoMenu[idx].order },
            },
            {
              $set: { order: (val: number) => val - 1 },
            },
            {
              multi: true,
            }
          );
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
          db.todoMenu.update(
            {
              parent: '',
              order: { $gt: state.todoMenu[idx].order },
            },
            {
              $set: { order: (val: number) => val - 1 },
            },
            {
              multi: true,
            }
          );
        }
      }
      db.todoMenu.update(
        { id: action.payload.listItem.id },
        action.payload.listItem
      );
      state.todoMenu[idx] = action.payload.listItem;
    },
    addTodoMenuFolder(state, action: PayloadAction<ListItem>) {
      db.todoMenu.insert(action.payload);
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
      // Represents the index of the folder item in the store
      const index = state.todoMenu.findIndex(
        (item) => item.id === action.payload.itemId
      );
      // Represents the order nubmer of the deleting folder item among the folders located in the root directory
      const workingIndex = action.payload.realRootItemIndexes.findIndex(
        (item) => item === index
      );
      // Subtract the order of all folders after the current folder by one
      db.todoMenu.update(
        { parent: '', order: { $gt: state.todoMenu[index].order } },
        { $set: { order: (val: number) => val - 1 } },
        { multi: true }
      );
      for (
        let i = workingIndex + 1;
        i < action.payload.realRootItemIndexes.length;
        i += 1
      ) {
        state.todoMenu[action.payload.realRootItemIndexes[i]].order -= 1;
      }
      //
      action.payload.realSubItemIndexes.forEach((val, idx) => {
        state.todoMenu[val] = {
          ...state.todoMenu[val],
          folder: false,
          parent: '',
          order: action.payload.realRootItemIndexes.length + idx - 1,
        };
      });
      db.todoMenu.update(
        { parent: state.todoMenu[index].id },
        {
          $set: {
            parent: '',
            order: (val: number, idx: number) =>
              action.payload.realRootItemIndexes.length + idx - 1,
          },
        },
        { multi: true }
      );
      db.todoMenu.remove({ id: state.todoMenu[index].id });
      state.todoMenu.splice(index, 1);
    },
    loadTag(state, action: PayloadAction<TagItem[]>) {
      state.tags = action.payload;
    },
    loadTodoMenu(state, action: PayloadAction<ListItem[]>) {
      state.todoMenu = action.payload;
    },
  },
});

export default dataReducer.reducer;
export const {
  loadTag,
  loadTodoMenu,
  deleteTag,
  addTag,
  editTag,
  addTodoMenu,
  editTodoMenu,
  deleteTodoMenu,
  breakTodoMenuFolder,
  addTodoMenuFolder,
} = dataReducer.actions;

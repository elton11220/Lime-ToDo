/* eslint-disable prettier/prettier */
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
  todoMenu: [{
    "id": "0",
    "title": "学习计划22",
    "folder": true,
    "parent": "",
    "color": ""
  },{
    "id": "1",
    "title": "做题",
    "folder": false,
    "parent": "0",
    "color": "#409eff"
  },{
    "id": "2",
    "title": "读书",
    "folder": false,
    "parent": "0",
    "color": "#ffaa00"
  },{
    "id": "3",
    "title": "独立的",
    "folder": false,
    "parent": "",
    "color": "#ff0000"
  }],
  tags: [],
};

const dataReducer = createSlice({
  name: namespace,
  initialState,
  reducers: {
    deleteTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((item) => item.id !== action.payload);
    },
    addTag(state, action: PayloadAction<TagItem>) {
      state.tags.push(action.payload)
    },
    deleteTodoMenu(state, action: PayloadAction<string>) {
      state.todoMenu = state.todoMenu.filter(
        (item) => item.id !== action.payload
      );
    },
    breakTodoMenuFolder(state, action: PayloadAction<string>) {
      const innerItems = state.todoMenu
        .filter((item) => item.parent === action.payload)
        .map((item) => ({ ...item, folder: false, parent: '' }));
      state.todoMenu = [
        ...state.todoMenu.filter(
          (item) => item.parent !== action.payload && item.id !== action.payload
        ),
        ...innerItems,
      ];
    },
  },
});

export default dataReducer.reducer;
export const { deleteTag, addTag, deleteTodoMenu, breakTodoMenuFolder } =
  dataReducer.actions;

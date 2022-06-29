/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const namespace = 'dataReducer';

interface InitialState {
  todoMenu: ListItem[];
  tags: TagItem[];
}

const initialState: InitialState = {
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
  tags: [{
    "id": "0",
    "title": "重要",
    "color": "#409eff"
  },{
    "id": "1",
    "title": "英语四级",
    "color": "#ccc"
  },{
    "id": "2",
    "title": "专业课",
    "color": "#0000ff"
  },],
};

const dataReducer = createSlice({
  name: namespace,
  initialState,
  reducers: {
    deleteTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((item) => item.id !== action.payload);
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
export const { deleteTag, deleteTodoMenu, breakTodoMenuFolder } =
  dataReducer.actions;

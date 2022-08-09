import React, { useCallback, useMemo, useState } from 'react';
import { Layout } from 'tdesign-react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import ToDoMenu from 'renderer/components/ToDoMenu';
import {
  deleteTag,
  addTag,
  deleteTodoMenu,
  addTodoMenuFolder,
  breakTodoMenuFolder,
  addTodoMenu,
  editTag,
  editTodoMenu,
} from 'renderer/redux/slice/dataReducer';

import ToDoList from 'renderer/components/ToDoList';
import { getTodoItemsMap } from 'renderer/utils/itemUtils';
import styles from './style.module.scss';
import TodoContext from './context';

const { Aside, Content } = Layout;

const connector = connect((state: any) => ({
  todoMenu: state.dataReducer.todoMenu,
  tags: state.dataReducer.tags,
  colors: state.dataReducer.colors,
  todoItems: state.dataReducer.todoItems,
}));

const Todos: React.FC<ConnectedProps<typeof connector>> = (props) => {
  const [active, setActive] = useState('collection');
  const { todoMenu, tags, colors, todoItems } = props;
  const todoItemsMap = useMemo(() => getTodoItemsMap(todoItems), [todoItems]);
  const todoMenuTitles = useMemo(() => {
    const map = new Map<string, string>();
    todoMenu.forEach((val: ListItem) => {
      map.set(val.id, val.title);
    });
    return map;
  }, [todoMenu]);
  const tagTitles = useMemo(() => {
    const map = new Map<string, string>();
    tags.forEach((val: ListItem) => {
      map.set(val.id, val.title);
    });
    return map;
  }, [tags]);
  const listTitles = useMemo(() => {
    return new Map([...todoMenuTitles, ...tagTitles]);
  }, [todoMenuTitles, tagTitles]);
  const dispatch = useDispatch();
  const deleteTagItem = useCallback((itemId: string) => {
    dispatch(deleteTag(itemId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addTagItem = useCallback(
    (item: TagItem) => {
      dispatch(addTag(item));
    },
    [dispatch]
  );
  const editTagItem = useCallback((item: TagItem) => {
    dispatch(editTag(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addTodoMenuItem = useCallback((item: ListItem) => {
    dispatch(addTodoMenu(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editTodoMenuItem = useCallback(
    (
      listItem: ListItem,
      realRootItemIndexes: number[],
      realSubItemIndexes: number[]
    ) => {
      dispatch(
        editTodoMenu({ listItem, realRootItemIndexes, realSubItemIndexes })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const deleteTodoMenuItem = useCallback(
    (itemId: string, realItemIndexes: number[]) => {
      dispatch(deleteTodoMenu({ itemId, realItemIndexes }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const addToDoMenuItemFolder = useCallback((item: ListItem) => {
    dispatch(addTodoMenuFolder(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const breakToDoMenuItemFolder = useCallback(
    (
      itemId: string,
      realSubItemIndexes: number[],
      realRootItemIndexes: number[]
    ) => {
      dispatch(
        breakTodoMenuFolder({ itemId, realSubItemIndexes, realRootItemIndexes })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const todoListTitle = useMemo<string>(() => {
    switch (active) {
      case 'today':
        return '今天';
      case 'recent':
        return '最近7天';
      case 'collection':
        return '收集箱';
      case 'finish':
        return '已完成';
      case 'trash':
        return '垃圾桶';
      default:
        return listTitles.get(active) ?? '';
    }
  }, [active, listTitles]);
  return (
    <Layout style={{ height: '100%' }}>
      <Aside>
        <ToDoMenu
          active={active}
          onChange={setActive}
          tags={tags}
          menu={todoMenu}
          colors={colors}
          onDeleteTagItem={deleteTagItem}
          onAddTagItem={addTagItem}
          onEditTagItem={editTagItem}
          onAddTodoMenuItem={addTodoMenuItem}
          onEditTodoMenuItem={editTodoMenuItem}
          onDeleteTodoMenuItem={deleteTodoMenuItem}
          onAddTodoMenuItemFolder={addToDoMenuItemFolder}
          onBreakTodoMenuItemFolder={breakToDoMenuItemFolder}
        />
      </Aside>
      <Content className={styles.content}>
        <TodoContext.Provider
          value={{
            todoMenuTitles,
            tagTitles,
            listTitles,
            active,
            todoItemsMap,
          }}
        >
          <ToDoList title={todoListTitle} />
        </TodoContext.Provider>
      </Content>
    </Layout>
  );
};

export default connector(Todos);

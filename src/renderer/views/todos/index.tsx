import React, { useCallback, useState } from 'react';
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
import styles from './style.module.scss';

const { Aside, Content } = Layout;

const connector = connect((state: any) => ({
  todos: state.dataReducer.todoMenu,
  tags: state.dataReducer.tags,
  colors: state.dataReducer.colors,
}));

const Todos: React.FC<ConnectedProps<typeof connector>> = (props) => {
  const [active, setActive] = useState('');
  const { todos, tags, colors } = props;
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
  const editTodoMenuItem = useCallback((item: ListItem) => {
    dispatch(editTodoMenu(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const breakToDoMenuItemFolder = useCallback((itemId: string) => {
    dispatch(breakTodoMenuFolder(itemId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout style={{ height: '100%' }}>
      <Aside>
        <ToDoMenu
          active={active}
          onChange={setActive}
          tags={tags}
          todos={todos}
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
      <Content>
        <span>123</span>
      </Content>
    </Layout>
  );
};

export default connector(Todos);

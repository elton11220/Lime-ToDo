import React, { useCallback, useState } from 'react';
import { Layout, DialogPlugin } from 'tdesign-react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import ToDoMenu from 'renderer/components/ToDoMenu';
import {
  deleteTag,
  addTag,
  deleteTodoMenu,
  addTodoMenuFolder,
  breakTodoMenuFolder,
  addTodoMenu,
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
    // @ts-ignore
    const dialog = DialogPlugin.confirm({
      header: '删除标签',
      body: '删除后，标签将会从任务中移除',
      confirmBtn: '确定',
      cancelBtn: '关闭',
      showOverlay: false,
      onConfirm: () => {
        dispatch(deleteTag(itemId));
        // @ts-ignore
        dialog.hide();
      },
      onClose: () => {
        // @ts-ignore
        dialog.hide();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addTagItem = useCallback(
    (item: TagItem) => {
      dispatch(addTag(item));
    },
    [dispatch]
  );
  const addTodoMenuItem = useCallback((item: ListItem) => {
    dispatch(addTodoMenu(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deleteTodoMenuItem = useCallback((itemId: string) => {
    // @ts-ignore
    const dialog = DialogPlugin.confirm({
      header: '删除清单',
      body: '删除清单会删除清单内的所有任务，确定要删除吗？',
      confirmBtn: '确定',
      cancelBtn: '关闭',
      showOverlay: false,
      onConfirm: () => {
        dispatch(deleteTodoMenu(itemId));
        // @ts-ignore
        dialog.hide();
      },
      onClose: () => {
        // @ts-ignore
        dialog.hide();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addToDoMenuItemFolder = useCallback((item: ListItem) => {
    dispatch(addTodoMenuFolder(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const breakToDoMenuItemFolder = useCallback((itemId: string) => {
    // @ts-ignore
    const dialog = DialogPlugin.confirm({
      header: '解散文件夹',
      body: '解散文件夹后，文件夹中的清单将直接显示在侧边栏中',
      confirmBtn: '确定',
      cancelBtn: '关闭',
      showOverlay: false,
      onConfirm: () => {
        dispatch(breakTodoMenuFolder(itemId));
        // @ts-ignore
        dialog.hide();
      },
      onClose: () => {
        // @ts-ignore
        dialog.hide();
      },
    });
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
          onAddTodoMenuItem={addTodoMenuItem}
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

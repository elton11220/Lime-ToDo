import React, { useContext, useEffect, useMemo, useState } from 'react';
import TodoContext from 'renderer/views/todos/context';
import { EllipsisIcon, MenuUnfoldIcon } from 'tdesign-icons-react';
import { Space } from 'tdesign-react';
import { SortedLinkedList } from 'utils/LinkedList';
import { connect, ConnectedProps } from 'react-redux';
import NewTaskInput from '../NewTaskInput';
import emptyTaskAnimation from '../../animations/empty-task.json';

import styles from './style.module.scss';
import Lottie from '../Lottie';
import ToDoItem from '../ToDoItem';

const connector = connect((state: any) => ({
  todoMenu: state.dataReducer.todoMenu,
  colors: state.dataReducer.colors,
}));

type ConnectorType = ConnectedProps<typeof connector>;

interface ToDoListProps extends ConnectorType {
  title: string;
}

const ToDoList: React.FC<ToDoListProps> = (props) => {
  const { active, tagTitles, todoItemsMap, todoMenuMap } =
    useContext(TodoContext);
  const { title, colors } = props;
  const newTaskInputPlaceholder = useMemo<string>(() => {
    if (active === 'today' || active === 'recent') {
      return '添加“今天”的任务至“收集箱”';
    }
    if (active === 'collection') {
      return '添加任务至“收集箱”，回车即可创建';
    }
    const isTag = tagTitles.has(active);
    return isTag ? `#${title}` : `添加任务至“${title}”，回车即可创建`;
  }, [active, tagTitles, title]);
  // Computed the target id of different cases.
  // Only the ID of the toDo menu item will be returned in the form of itself, and the rest will be returned as 'collection'
  const defaultTargetId = useMemo<string>(() => {
    if (
      active === 'recent' ||
      active === 'today' ||
      active === 'collection' ||
      tagTitles.has(active)
    ) {
      return 'collection';
    }
    return active;
  }, [active, tagTitles]);
  // The id of the target list where the new task will be inserted
  const [newTaskTargetId, setNewTaskTargetId] = useState(defaultTargetId);
  useEffect(() => {
    setNewTaskTargetId(defaultTargetId);
  }, [defaultTargetId]);
  // 'today', 'recent', 'finish', 'trash' are lists obtained by computed, and only todo menus and 'collection' are mapped to their sub items
  const todoItems = useMemo<SortedLinkedList<TodoItem>>(() => {
    if (active === 'today') {
      //
    }
    if (active === 'recent') {
      //
    }
    if (active === 'collection') {
      //
    }
    if (active === 'finish') {
      //
    }
    if (active === 'trash') {
      //
    }
    const list = todoItemsMap.get(active);
    if (list !== null) {
      return list;
    }
    return new SortedLinkedList<TodoItem>();
  }, [active, todoItemsMap]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <MenuUnfoldIcon size="22px" />
          <div className={styles.title}>{title}</div>
        </div>
        <Space>
          <EllipsisIcon size="22px" />
        </Space>
      </div>
      {active !== 'trash' && active !== 'finish' ? (
        <div className={styles.inputWrapper}>
          <NewTaskInput
            placeholder={newTaskInputPlaceholder}
            targetId={newTaskTargetId}
          />
        </div>
      ) : null}
      {todoItems.length > 0 ? (
        <div className={styles.todoItems}>
          {todoItems.mapToArray((todoItem: TodoItem) => (
            <ToDoItem
              key={todoItem.id}
              initialValue={todoItem}
              sideColor={
                colors[(todoMenuMap.get(todoItem.parent) as ListItem)?.color] ??
                'transparent'
              }
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.empty}>
            <Lottie size="300px" animationData={emptyTaskAnimation} />
            <div className={styles.description}>
              <div>没有任务，放松一下</div>
              <div>想记点什么？点击输入框写下来</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connector(ToDoList);

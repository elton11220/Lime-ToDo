import React, { useContext, useEffect, useMemo, useState } from 'react';
import TodoContext from 'renderer/views/todos/context';
import { EllipsisIcon, MenuUnfoldIcon } from 'tdesign-icons-react';
import { Space } from 'tdesign-react';
import { SortedLinkedList } from 'utils/LinkedList';
import NewTaskInput from '../NewTaskInput';
import emptyTaskAnimation from '../../animations/empty-task.json';

import styles from './style.module.scss';
import Lottie from '../Lottie';

interface ToDoListProps {
  title: string;
}

const ToDoList: React.FC<ToDoListProps> = (props) => {
  const { active, tagTitles, todoItemsMap } = useContext(TodoContext);
  const { title } = props;
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
  const [newTaskTargetId, setNewTaskTargetId] = useState(defaultTargetId);
  useEffect(() => {
    setNewTaskTargetId(defaultTargetId);
  }, [defaultTargetId]);
  const todoItems = useMemo<SortedLinkedList<TodoItem>>(() => {
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
          <div>placeholder</div>
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

export default ToDoList;

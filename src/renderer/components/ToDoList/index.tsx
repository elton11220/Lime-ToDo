import React, { useContext, useEffect, useMemo, useState } from 'react';
import TodoContext from 'renderer/views/todos/context';
// import TodoContext from 'renderer/views/todos/context';
import { EllipsisIcon, MenuUnfoldIcon } from 'tdesign-icons-react';
import { Space } from 'tdesign-react';
import NewTaskInput from '../NewTaskInput';

import styles from './style.module.scss';

interface ToDoListProps {
  title: string;
}

const ToDoList: React.FC<ToDoListProps> = (props) => {
  const { active, tagTitles } = useContext(TodoContext);
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
    </div>
  );
};

export default ToDoList;

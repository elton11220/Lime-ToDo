import React, { useContext, useMemo } from 'react';
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
  const { active } = useContext(TodoContext);
  const { title } = props;
  const newTaskInputPlaceholder = useMemo<string>(() => {
    if (active === 'today' || active === 'recent') {
      return '添加“今天”的任务至“收集箱”';
    }
    if (active === 'collection') {
      return '添加任务至“收集箱”，回车即可创建';
    }
    return `添加任务至“${title}”，回车即可创建`;
  }, [title, active]);
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
          <NewTaskInput placeholder={newTaskInputPlaceholder} />
        </div>
      ) : null}
    </div>
  );
};

export default ToDoList;

import React from 'react';
import { EllipsisIcon, MenuUnfoldIcon } from 'tdesign-icons-react';
import { Space } from 'tdesign-react';

import styles from './style.module.scss';

const ToDoList: React.FC = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <MenuUnfoldIcon size="22px" />
          <div className={styles.title}>title</div>
        </div>
        <Space>
          <EllipsisIcon size="22px" />
        </Space>
      </div>
    </div>
  );
};

export default ToDoList;

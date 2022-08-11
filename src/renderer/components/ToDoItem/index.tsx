import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';

import CheckInputBox from '../CheckInputBox';
import styles from './style.module.scss';

interface ToDoItemProps {
  sideColor?: string;
  initialValue: TodoItem;
  readonly?: boolean;
  finish?: boolean;
}

const ToDoItem: FC<ToDoItemProps> = (props) => {
  const { sideColor, initialValue, readonly, finish } = props;
  const [checked, setChecked] = useState(false);
  return (
    <div className={styles.container} style={{ borderLeftColor: sideColor }}>
      <div className={styles.main}>
        <CheckInputBox
          initialValue="初始值"
          checked={checked}
          onChange={(check) => {
            setChecked(check);
          }}
          priority={initialValue.priority}
        />
      </div>
      <div className={styles.detail}>
        {
          //
        }
      </div>
    </div>
  );
};

ToDoItem.defaultProps = {
  sideColor: 'transparent',
  readonly: false,
  finish: false,
};

export default memo(ToDoItem);

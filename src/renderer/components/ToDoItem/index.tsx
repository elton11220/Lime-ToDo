import { memo, useState } from 'react';
import type { FC } from 'react';

import CheckInputBox from '../CheckInputBox';
import styles from './style.module.scss';

interface ToDoItemProps {
  sideColor?: string;
  initialValue: TodoItem;
}

const ToDoItem: FC<ToDoItemProps> = (props) => {
  const { sideColor, initialValue } = props;
  const [value, setValue] = useState(initialValue);
  return (
    <div className={styles.container} style={{ borderLeftColor: sideColor }}>
      <div className={styles.main}>
        <CheckInputBox
          value={value.data.title}
          checked={value.finish}
          onChangeChecked={(check) => {
            setValue((state) => ({ ...state, finish: check }));
          }}
          onChangeValue={(val) => {
            setValue((state) => ({
              ...state,
              data: { ...state.data, title: val },
            }));
          }}
          priority={value.priority}
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
};

export default memo(ToDoItem);

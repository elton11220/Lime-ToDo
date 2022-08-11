import { createElement, FC, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { CheckIcon } from 'tdesign-icons-react';
import { TodoItemPriority } from 'renderer/utils/itemUtils';

import styles from './style.module.scss';

interface CheckInputBoxProps {
  priority?: TodoItemPriority;
  checked: boolean;
  onChange: (checked: boolean) => void;
  initialValue: string;
}

const CheckInputBox: FC<CheckInputBoxProps> = (props) => {
  const { priority, checked, initialValue, onChange } = props;
  const [value, setValue] = useState(initialValue);
  const priorityColor = useMemo(() => {
    if (priority === TodoItemPriority.none) {
      return 'var(--td-component-border)';
    }
    if (priority === TodoItemPriority.low) {
      return '#1890ff';
    }
    if (priority === TodoItemPriority.medium) {
      return '#faad14';
    }
    if (priority === TodoItemPriority.high) {
      return '#ff4d4f';
    }
    return 'var(--td-component-border)';
  }, [priority]);
  const triggerChange = () => {
    if (checked) {
      onChange(false);
    } else {
      onChange(true);
    }
  };
  return (
    <div className={styles.container}>
      <div
        className={styles.checkBox}
        style={{ borderColor: priorityColor }}
        onClick={triggerChange}
      >
        {createElement(
          'div',
          {
            className: styles.state,
            style: {
              '--bgColor': `${priorityColor}20`,
              backgroundColor: checked ? priorityColor : null,
            },
          },
          checked ? (
            <CheckIcon color="var(--td-bg-color-container)" size="15px" />
          ) : null
        )}
      </div>
      <input
        className={styles.inputBox}
        type="text"
        value={value}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

CheckInputBox.defaultProps = {
  priority: 0,
};

export default CheckInputBox;

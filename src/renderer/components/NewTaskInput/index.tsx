import React, { memo, useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AddIcon } from 'tdesign-icons-react';

import styles from './style.module.scss';

interface NewTaskInputProps {
  placeholder: string;
  targetId: string;
}

const NewTaskInput: React.FC<NewTaskInputProps> = (props) => {
  const { placeholder, targetId } = props;
  const [inputState, setInputState] = useState<{
    value: string;
    focused: boolean;
  }>({
    value: '',
    focused: false,
  });
  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputState((state) => ({
      ...state,
      value: e.target.value,
    }));
  }, []);
  return (
    <div
      className={`${styles.container} ${
        inputState.focused ? styles.focus : null
      }`}
    >
      <input
        className={styles.input}
        value={inputState.value}
        onChange={onInputChange}
        onFocus={() => {
          setInputState((state) => ({
            ...state,
            focused: true,
          }));
        }}
        onBlur={() => {
          setInputState((state) => ({
            ...state,
            focused: false,
          }));
        }}
      />
      {!inputState.value.length && (
        <div className={styles.placeholder}>
          <AddIcon
            size="22px"
            color="var(--td-text-color-placeholder)"
            style={{ flexShrink: 0 }}
          />
          <div className={styles.content}>{placeholder}</div>
        </div>
      )}
      <span>{targetId}</span>
    </div>
  );
};

export default memo(NewTaskInput);

import { memo, useContext, useState } from 'react';
import type { FC } from 'react';

import { Space, Tag, Tooltip } from 'tdesign-react';
import TodoContext from 'renderer/views/todos/context';
import CheckInputBox from '../CheckInputBox';
import styles from './style.module.scss';

interface ToDoItemProps {
  sideColor?: string;
  initialValue: TodoItem;
}

const ToDoItem: FC<ToDoItemProps> = (props) => {
  const { sideColor, initialValue } = props;
  const [value, setValue] = useState(initialValue);
  const { tagMap, colors } = useContext(TodoContext);
  const removeTag = (tagId: string) => {
    setValue((state) => ({
      ...state,
      data: {
        ...state.data,
        tags: state.data.tags.filter((tag) => tag !== tagId),
      },
    }));
  };
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
        <Space size="small" style={{ marginLeft: '8px' }}>
          {value.data.tags.slice(0, 2).map((tagId: string) => {
            const tagData = tagMap.get(tagId) as TagItem;
            const element =
              tagData.title.length > 6 ? (
                <Tooltip
                  content={tagData.title}
                  showArrow={false}
                  key={tagData.id}
                  delay={2}
                >
                  <Tag
                    shape="round"
                    size="small"
                    maxWidth="100px"
                    style={{ backgroundColor: `${colors[tagData.color]}55` }}
                    className={styles.tag}
                  >
                    {tagData.title}
                    <div
                      className={styles.removeTagBtn}
                      onClick={() => {
                        removeTag(tagData.id);
                      }}
                    >
                      <div>
                        <div />
                        <div />
                      </div>
                    </div>
                  </Tag>
                </Tooltip>
              ) : (
                <Tag
                  shape="round"
                  size="small"
                  maxWidth="100px"
                  style={{ backgroundColor: `${colors[tagData.color]}55` }}
                  className={styles.tag}
                  key={tagData.id}
                >
                  {tagData.title}
                  <div
                    className={styles.removeTagBtn}
                    onClick={() => {
                      removeTag(tagData.id);
                    }}
                  >
                    <div>
                      <div />
                      <div />
                    </div>
                  </div>
                </Tag>
              );
            return element;
          })}
          {value.data.tags.length > 2 ? (
            <Tag shape="round" size="small">
              +{value.data.tags.length - 2}
            </Tag>
          ) : null}
        </Space>
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

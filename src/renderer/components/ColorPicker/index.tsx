import React, { memo, useCallback, useMemo, useState } from 'react';
import { CheckCircleFilledIcon, MinusCircleIcon } from 'tdesign-icons-react';
import { Popup } from 'tdesign-react';

import styles from './style.module.scss';

const defaultColors = [
  // eslint-disable-next-line prettier/prettier
  '#deefb7', '#98dfaf', '#5fb49c', '#414288', '#682d63',
  // eslint-disable-next-line prettier/prettier
  '#fe9c8f', '#feb2a8', '#fec8c1', '#fad9c1', '#f9caa7',
  // eslint-disable-next-line prettier/prettier
  '#91e5f6', '#84d2f6', '#59a5d8', '#386fa4', '#133c55',
  // eslint-disable-next-line prettier/prettier
  '#fdc921', '#fdd85d', '#f76c5e', '#99d6ea', '#6798c0',
  // eslint-disable-next-line prettier/prettier
  '#ffdde1', '#ffb8de', '#ff74d4', '#ff36ab', '#642ca9',
  // eslint-disable-next-line prettier/prettier
  '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9', '#ff99c8',
  // eslint-disable-next-line prettier/prettier
  '#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d',
  // eslint-disable-next-line prettier/prettier
  '#dad873', '#8cffda', '#ffb2e6', '#d972ff',
];

interface ColorPickerProps {
  size?: string;
  colors?: string[];
  value: number;
  onChange: (v: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { size, value, onChange, colors } = props;
  const renderColors = useMemo(
    () => ((colors as string[]).length > 0 ? colors : defaultColors),
    [colors]
  );
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const onVisibleChange = useCallback((v: boolean) => {
    setPopUpVisible(v);
  }, []);
  return (
    <>
      <Popup
        trigger="click"
        visible={popUpVisible}
        onVisibleChange={onVisibleChange}
        showArrow
        placement="bottom-left"
        content={
          <div className={styles.colors}>
            {renderColors?.map((item, index) => (
              <div
                className={styles.color}
                key={item}
                style={{ backgroundColor: item }}
                onClick={() => {
                  onChange(index);
                  onVisibleChange(false);
                }}
              >
                {value === index ? (
                  <CheckCircleFilledIcon className={styles.checkedIcon} />
                ) : null}
              </div>
            ))}
            <div
              className={styles.color}
              onClick={() => {
                onChange(-1);
                onVisibleChange(false);
              }}
            >
              <MinusCircleIcon
                size="40"
                style={{ color: 'var(--td-warning-color)' }}
              />
              {value === -1 ? (
                <CheckCircleFilledIcon className={styles.checkedIcon} />
              ) : null}
            </div>
          </div>
        }
      >
        <div
          style={{ width: `${size}px`, height: `${size}px` }}
          className={styles.container}
          onClick={() => {
            if (popUpVisible) {
              onVisibleChange(false);
            } else {
              onVisibleChange(true);
            }
          }}
        >
          <div
            className={styles.color}
            style={{ backgroundColor: (renderColors as string[])[value] }}
          >
            {value === -1 ? (
              <MinusCircleIcon
                size="30"
                style={{ color: 'var(--td-warning-color)' }}
              />
            ) : null}
          </div>
        </div>
      </Popup>
    </>
  );
};

ColorPicker.defaultProps = {
  size: '30',
  colors: [],
};

export default memo(ColorPicker);

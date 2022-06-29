import React, { useEffect, useMemo, memo } from 'react';
import { Menu } from 'tdesign-react';
import {
  TimeIcon,
  BrowseIcon,
  ClearIcon,
  CheckCircleIcon,
  RootListIcon,
  FolderOpenIcon,
  ViewListIcon,
  DiscountIcon,
} from 'tdesign-icons-react';

import styles from './style.module.scss';

const { MenuItem, SubMenu, MenuGroup } = Menu;

const resolveList: (
  data: ListItem[]
) => Array<RenderListItem | RenderListItemFolder> = (data: Array<ListItem>) => {
  // Convert the todo data list from a database format to a renderable format
  if (data instanceof Array) {
    const newArr: Array<RenderListItem | RenderListItemFolder> = [];
    data.forEach((value) => {
      if (value.folder) {
        newArr.push({
          id: value.id,
          title: value.title,
          children: [],
          folder: true,
        });
      } else if (value.parent !== '') {
        const index = newArr.findIndex((val) => val.id === value.parent);
        if (index !== -1) {
          (newArr[index] as RenderListItemFolder).children.push({
            id: value.id,
            title: value.title,
            color: value.color,
            folder: false,
          });
        }
      } else {
        newArr.push({
          id: value.id,
          title: value.title,
          color: value.color,
          folder: false,
        });
      }
    });
    return newArr;
  }
  return [];
};

interface ToDoMenuProps {
  active: string;
  onChange: (v: string) => void;
  tags: any;
  todos: any;
  onDeleteTodoMenuItem: (itemId: unknown) => void;
  onDeleteTagItem: (itemId: unknown) => void;
}

const ToDoMenu: React.FC<ToDoMenuProps> = (props) => {
  const {
    active,
    onChange,
    tags,
    todos,
    onDeleteTagItem,
    onDeleteTodoMenuItem,
  } = props;
  const todoMenu = useMemo(() => resolveList(todos), [todos]);
  const showContextMenu = (e: any) => {
    e.preventDefault();
    const itemID = e.target.getAttribute('itemid');
    const itemType = e.target.getAttribute('itemtype');
    if (itemType === null || itemID === null) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('show-context-menu', {
      itemType,
      itemID,
    });
  };
  useEffect(() => {
    const deleteTagItemListener = window.electron.ipcRenderer.on(
      'delete-tagItem-menu',
      onDeleteTagItem
    ) as () => void;
    const deleteToDoMenuItemListener = window.electron.ipcRenderer.on(
      'delete-toDoMenuItem-menu',
      onDeleteTodoMenuItem
    ) as () => void;
    return () => {
      deleteTagItemListener();
      deleteToDoMenuItemListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div onContextMenu={showContextMenu}>
      <Menu
        value={active}
        onChange={(v: any) => onChange(v)}
        defaultValue="new"
      >
        <MenuItem value="today" icon={<BrowseIcon />}>
          今天
        </MenuItem>
        <MenuItem value="recent" icon={<TimeIcon />}>
          最近7天
        </MenuItem>
        <MenuItem value="new" icon={<RootListIcon />}>
          未分类
        </MenuItem>
        <MenuItem value="finish" icon={<CheckCircleIcon />}>
          已完成
        </MenuItem>
        <MenuItem value="trash" icon={<ClearIcon />}>
          垃圾桶
        </MenuItem>
        <MenuGroup title="清单">
          {todoMenu.map((item) => {
            if (!item.folder) {
              return (
                <MenuItem value={item.id} key={item.id} icon={<ViewListIcon />}>
                  <div
                    className={styles.identifier}
                    itemID={item.id}
                    itemType="toDoMenuItem"
                  />
                  <div className={styles.menuItem}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.indicators}>
                      <div
                        className={styles.color}
                        style={{ backgroundColor: item?.color }}
                      />
                      <div
                        className={styles.number}
                        style={{
                          color:
                            active === item.id
                              ? '#fff'
                              : 'var(--td-text-color-primary)',
                        }}
                      >
                        0
                      </div>
                    </div>
                  </div>
                </MenuItem>
              );
            }
            const children = item.children.map((child) => (
              <MenuItem value={child.id} key={child.id} icon={<ViewListIcon />}>
                <div
                  className={styles.identifier}
                  itemID={child.id}
                  itemType="toDoMenuItem"
                />
                <div className={styles.menuItem} style={{ width: '132px' }}>
                  <div className={styles.title}>{child.title}</div>
                  <div className={styles.indicators}>
                    <div
                      className={styles.color}
                      style={{ backgroundColor: child?.color }}
                    />
                    <div
                      className={styles.number}
                      style={{
                        color:
                          active === child.id
                            ? '#fff'
                            : 'var(--td-text-color-primary)',
                      }}
                    >
                      0
                    </div>
                  </div>
                </div>
              </MenuItem>
            ));
            return (
              <SubMenu
                value={item.id}
                key={item.id}
                title={item.title}
                icon={<FolderOpenIcon />}
              >
                {children}
              </SubMenu>
            );
          })}
        </MenuGroup>
        <MenuGroup title="标签">
          {tags.map((item: TagItem) => (
            <MenuItem key={item.id} value={item.id} icon={<DiscountIcon />}>
              <div
                className={styles.identifier}
                itemID={item.id}
                itemType="tagItem"
              />
              <div className={styles.menuItem}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.indicators}>
                  <div
                    className={styles.color}
                    style={{ backgroundColor: item?.color }}
                  />
                  <div
                    className={styles.number}
                    style={{
                      color:
                        active === item.id
                          ? '#fff'
                          : 'var(--td-text-color-primary)',
                    }}
                  >
                    0
                  </div>
                </div>
              </div>
            </MenuItem>
          ))}
        </MenuGroup>
      </Menu>
    </div>
  );
};

export default memo(ToDoMenu);

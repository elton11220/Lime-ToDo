import React, { useEffect, useMemo, memo, useState } from 'react';
import { Menu } from 'tdesign-react';
import type { MenuValue } from 'tdesign-react';
import {
  TimeIcon,
  BrowseIcon,
  ClearIcon,
  CheckCircleIcon,
  RootListIcon,
  FolderOpenIcon,
  ViewListIcon,
  DiscountIcon,
  EllipsisIcon,
} from 'tdesign-icons-react';
import useTitleBarAreaRect from 'renderer/hooks/useTitleBarAreaRect';
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
  onDeleteTodoMenuItem: (itemId: any) => void;
  onDeleteTagItem: (itemId: any) => void;
  onBreakTodoMenuItemFolder: (itemId: any) => void;
}

const ToDoMenu: React.FC<ToDoMenuProps> = (props) => {
  const {
    active,
    onChange,
    tags,
    todos,
    onDeleteTagItem,
    onDeleteTodoMenuItem,
    onBreakTodoMenuItemFolder,
  } = props;
  const todoMenu = useMemo(() => resolveList(todos), [todos]);
  const [expanded, setExpanded] = useState<MenuValue[]>([]);
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
  const showContextMenuByClick = (itemType: string, itemID: string) => {
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
    const breakToDoMenuItemFolderListener = window.electron.ipcRenderer.on(
      'break-toDoMenuItemFolder-menu',
      onBreakTodoMenuItemFolder
    ) as () => void;
    return () => {
      deleteTagItemListener();
      deleteToDoMenuItemListener();
      breakToDoMenuItemFolderListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { height: sysTitleBarHeight } = useTitleBarAreaRect();
  return (
    <div
      onContextMenu={showContextMenu}
      className={styles.container}
      style={{ height: `calc(100vh - ${sysTitleBarHeight}px)` }}
    >
      <Menu
        value={active}
        onChange={(v: any) => onChange(v)}
        defaultValue="new"
        expanded={expanded}
        onExpand={setExpanded}
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
                  >
                    <EllipsisIcon
                      className={styles.moreBtn}
                      style={{
                        color:
                          active === item.id
                            ? '#fff'
                            : 'var(--td-text-color-primary)',
                      }}
                      onClick={() => {
                        showContextMenuByClick('toDoMenuItem', item.id);
                      }}
                    />
                  </div>
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
                >
                  <EllipsisIcon
                    className={styles.moreBtn}
                    style={{
                      color:
                        active === child.id
                          ? '#fff'
                          : 'var(--td-text-color-primary)',
                    }}
                    onClick={() => {
                      showContextMenuByClick('toDoMenuItem', child.id);
                    }}
                  />
                </div>
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
                title={
                  <>
                    <div
                      className={styles.identifier}
                      itemID={item.id}
                      itemType="toDoMenuItemFolder"
                    >
                      <EllipsisIcon
                        className={styles.moreBtn}
                        style={{
                          color:
                            !expanded.includes(item.id) &&
                            todos.find((todo: ListItem) => todo.id === active)
                              ?.parent === item.id
                              ? '#fff'
                              : 'var(--td-text-color-primary)',
                        }}
                        onClick={() => {
                          showContextMenuByClick('toDoMenuItemFolder', item.id);
                        }}
                      />
                    </div>
                    <div className={styles.menuItem} style={{ width: '140px' }}>
                      <div className={styles.title}>{item.title}</div>
                    </div>
                  </>
                }
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
              >
                <EllipsisIcon
                  className={styles.moreBtn}
                  style={{
                    color:
                      active === item.id
                        ? '#fff'
                        : 'var(--td-text-color-primary)',
                  }}
                  onClick={() => {
                    showContextMenuByClick('tagItem', item.id);
                  }}
                />
              </div>
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

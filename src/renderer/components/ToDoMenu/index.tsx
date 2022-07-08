import React, {
  useEffect,
  useMemo,
  memo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Dialog, DialogPlugin, Form, Input, Menu, Select } from 'tdesign-react';
import type { MenuValue, InputValue } from 'tdesign-react';
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
  AddIcon,
  ChevronDownIcon,
} from 'tdesign-icons-react';
import useTitleBarAreaRect from 'renderer/hooks/useTitleBarAreaRect';
import styles from './style.module.scss';
import ColorPicker from '../ColorPicker';
import HrDivider from '../HrDivider';

const { MenuItem, SubMenu, MenuGroup } = Menu;
const { FormItem } = Form;
const { Option } = Select;

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
  colors: string[];
  onAddTodoMenuItem: (item: ListItem) => void;
  onDeleteTodoMenuItem: (itemId: any) => void;
  onDeleteTagItem: (itemId: any) => void;
  onAddTodoMenuItemFolder: (item: ListItem) => void;
  onBreakTodoMenuItemFolder: (itemId: any) => void;
  onAddTagItem: (item: TagItem) => void;
}

const ToDoMenu: React.FC<ToDoMenuProps> = (props) => {
  const {
    active,
    onChange,
    tags,
    todos,
    colors,
    onDeleteTagItem,
    onAddTodoMenuItem,
    onDeleteTodoMenuItem,
    onAddTodoMenuItemFolder,
    onBreakTodoMenuItemFolder,
    onAddTagItem,
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
      (tagId) => {
        // @ts-ignore
        const dialog = DialogPlugin.confirm({
          header: '删除标签',
          body: '删除后，标签将会从任务中移除',
          confirmBtn: '确定',
          cancelBtn: '关闭',
          showOverlay: false,
          onConfirm: () => {
            onDeleteTagItem(tagId);
            // @ts-ignore
            dialog.hide();
          },
          onClose: () => {
            // @ts-ignore
            dialog.hide();
          },
        });
      }
    ) as () => void;
    const deleteToDoMenuItemListener = window.electron.ipcRenderer.on(
      'delete-toDoMenuItem-menu',
      (itemId) => {
        // @ts-ignore
        const dialog = DialogPlugin.confirm({
          header: '删除清单',
          body: '删除清单会删除清单内的所有任务，确定要删除吗？',
          confirmBtn: '确定',
          cancelBtn: '关闭',
          showOverlay: false,
          onConfirm: () => {
            onDeleteTodoMenuItem(itemId);
            // @ts-ignore
            dialog.hide();
          },
          onClose: () => {
            // @ts-ignore
            dialog.hide();
          },
        });
      }
    ) as () => void;
    const breakToDoMenuItemFolderListener = window.electron.ipcRenderer.on(
      'break-toDoMenuItemFolder-menu',
      (itemId) => {
        // @ts-ignore
        const dialog = DialogPlugin.confirm({
          header: '解散文件夹',
          body: '解散文件夹后，文件夹中的清单将直接显示在侧边栏中',
          confirmBtn: '确定',
          cancelBtn: '关闭',
          showOverlay: false,
          onConfirm: () => {
            onBreakTodoMenuItemFolder(itemId);
            // @ts-ignore
            dialog.hide();
          },
          onClose: () => {
            // @ts-ignore
            dialog.hide();
          },
        });
      }
    ) as () => void;
    return () => {
      deleteTagItemListener();
      deleteToDoMenuItemListener();
      breakToDoMenuItemFolderListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { height: sysTitleBarHeight } = useTitleBarAreaRect();
  const [addTagItemDialogShow, setAddTagItemDialogShow] =
    useState<boolean>(false);
  const onAddTagItemDialogForm = useRef<HTMLFormElement>();
  const onAddTagItemDialogConfirm = useCallback(async () => {
    if ((await onAddTagItemDialogForm.current?.validate()) === true) {
      onAddTagItem({
        id: new Date().getTime().toString(),
        ...onAddTagItemDialogForm.current?.getFieldsValue(['color', 'title']),
      });
      setAddTagItemDialogShow(false);
    }
  }, [onAddTagItem]);
  const getRandomColorId = useCallback(() => {
    return Math.floor(Math.random() * colors.length);
  }, [colors]);
  const addTodoMenuItemForm = useRef<HTMLFormElement>();
  const [addTodoMenuItemFolderInputValue, setAddTodoMenuItemFolderInputValue] =
    useState<string>();
  const [
    addTodoMenuItemFolderPopUpVisible,
    setAddTodoMenuItemFolderPopUpVisible,
  ] = useState<boolean>(false);
  const addTodoMenuItemFolder = useCallback(
    (value: InputValue) => {
      if (value !== '') {
        const id = new Date().getTime().toString();
        onAddTodoMenuItemFolder({
          id,
          title: value as string,
          folder: true,
          parent: '',
          color: -1,
        });
        setAddTodoMenuItemFolderInputValue(() => '');
        addTodoMenuItemForm.current?.setFields([{ name: 'parent', value: id }]);
        setAddTodoMenuItemFolderPopUpVisible(false);
      }
    },
    [onAddTodoMenuItemFolder]
  );
  const [addTodoMenuItemDialogShow, setAddTodoMenuItemDialogShow] =
    useState<boolean>(false);
  const onAddTodoMenuItemDialogConfirm = useCallback(async () => {
    if ((await addTodoMenuItemForm.current?.validate()) === true) {
      onAddTodoMenuItem({
        id: new Date().getTime().toString(),
        ...addTodoMenuItemForm.current?.getFieldsValue([
          'title',
          'parent',
          'color',
        ]),
        folder: false,
      });
      setAddTodoMenuItemDialogShow(false);
    }
  }, [onAddTodoMenuItem]);
  const todoMenuFolders = useMemo(
    () => [
      <Option value="-1" disabled>
        <Input
          size="small"
          maxlength={25}
          placeholder="按回车添加文件夹"
          onEnter={addTodoMenuItemFolder}
          value={addTodoMenuItemFolderInputValue}
          onChange={(value) => {
            setAddTodoMenuItemFolderInputValue(value as string);
          }}
        />
      </Option>,
      <HrDivider top={10} bottom={15} />,
      <Option label="无" value="" />,
      ...todos
        .filter((item: ListItem) => item.folder === true)
        .map((item: ListItem) => <Option label={item.title} value={item.id} />),
    ],
    [addTodoMenuItemFolder, addTodoMenuItemFolderInputValue, todos]
  );
  return (
    <>
      <Dialog
        visible={addTodoMenuItemDialogShow}
        header="添加菜单"
        confirmBtn="保存"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setAddTodoMenuItemDialogShow(false);
        }}
        onConfirm={onAddTodoMenuItemDialogConfirm}
      >
        <Form style={{ marginTop: '20px' }} ref={addTodoMenuItemForm}>
          <FormItem
            label="名称"
            name="title"
            rules={[
              { message: '清单名称不能为空', type: 'error', required: true },
            ]}
          >
            <Input placeholder="名称" />
          </FormItem>
          <FormItem label="文件夹" name="parent" initialData="">
            <Select
              showArrow={false}
              selectInputProps={{
                popupVisible: addTodoMenuItemFolderPopUpVisible,
                onPopupVisibleChange: () => {
                  setAddTodoMenuItemFolderPopUpVisible((state) => !state);
                },
              }}
              onChange={() => {
                setAddTodoMenuItemFolderPopUpVisible((state) => !state);
              }}
            >
              {...todoMenuFolders}
            </Select>
            <ChevronDownIcon
              className={`${styles.selectIcon} ${
                addTodoMenuItemFolderPopUpVisible ? styles.rotate : ''
              }`}
            />
          </FormItem>
          <FormItem label="颜色" name="color" initialData={getRandomColorId}>
            {
              // @ts-ignore
              React.createElement(ColorPicker, { colors })
            }
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        visible={addTagItemDialogShow}
        header="添加标签"
        confirmBtn="保存"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setAddTagItemDialogShow(false);
        }}
        onConfirm={onAddTagItemDialogConfirm}
      >
        <Form ref={onAddTagItemDialogForm} style={{ marginTop: '20px' }}>
          <FormItem
            label="名称"
            name="title"
            rules={[
              { message: '标签名称不能为空', type: 'error', required: true },
            ]}
          >
            <Input placeholder="标签" />
          </FormItem>
          <FormItem label="颜色" name="color" initialData={getRandomColorId}>
            {
              // @ts-ignore
              React.createElement(ColorPicker, { colors })
            }
          </FormItem>
        </Form>
      </Dialog>
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
          <MenuGroup
            title={
              <div className={styles.menuGroupTitleContainer}>
                <span>清单</span>
                <AddIcon
                  size="large"
                  style={{ color: 'var(--td-text-color-placeholder)' }}
                  className={`${styles.icon} ${
                    todoMenu.length <= 0 ? styles.active : null
                  }`}
                  onClick={() => {
                    setAddTodoMenuItemDialogShow(true);
                  }}
                />
              </div>
            }
          >
            {todoMenu.map((item) => {
              if (!item.folder) {
                return (
                  <MenuItem
                    value={item.id}
                    key={item.id}
                    icon={<ViewListIcon />}
                  >
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
                          style={{
                            backgroundColor:
                              item?.color === -1
                                ? 'transparent'
                                : colors[item.color],
                          }}
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
                <MenuItem
                  value={child.id}
                  key={child.id}
                  icon={<ViewListIcon />}
                >
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
                        style={{
                          backgroundColor:
                            child?.color === -1
                              ? 'transparent'
                              : colors[child.color],
                        }}
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
                            showContextMenuByClick(
                              'toDoMenuItemFolder',
                              item.id
                            );
                          }}
                        />
                      </div>
                      <div
                        className={styles.menuItem}
                        style={{ width: '140px' }}
                      >
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
          <MenuGroup
            title={
              <div className={styles.menuGroupTitleContainer}>
                <span>标签</span>
                <AddIcon
                  size="large"
                  style={{ color: 'var(--td-text-color-placeholder)' }}
                  className={`${styles.icon} ${
                    tags.length <= 0 ? styles.active : null
                  }`}
                  onClick={() => {
                    setAddTagItemDialogShow(true);
                  }}
                />
              </div>
            }
          >
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
                      style={{
                        backgroundColor:
                          item?.color === -1
                            ? 'transparent'
                            : colors[item.color],
                      }}
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
    </>
  );
};

export default memo(ToDoMenu);

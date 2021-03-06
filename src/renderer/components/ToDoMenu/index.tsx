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
  FolderIcon,
} from 'tdesign-icons-react';
import useTitleBarAreaRect from 'renderer/hooks/useTitleBarAreaRect';
import { flatToTree, getNextOrder } from 'renderer/utils/menuUtils';
import styles from './style.module.scss';
import ColorPicker from '../ColorPicker';
import HrDivider from '../HrDivider';

const { MenuItem, SubMenu, MenuGroup } = Menu;
const { FormItem } = Form;
const { Option } = Select;

interface ToDoMenuProps {
  active: string;
  onChange: (v: string) => void;
  tags: any;
  menu: any;
  colors: string[];
  onAddTodoMenuItem: (item: ListItem) => void;
  onEditTodoMenuItem: (
    item: ListItem,
    realRootItemIndexes: number[],
    realSubItemIndexes: number[]
  ) => void;
  onDeleteTodoMenuItem: (itemId: any, realItemIndexes: number[]) => void;
  onDeleteTagItem: (itemId: any) => void;
  onAddTodoMenuItemFolder: (item: ListItem) => void;
  onBreakTodoMenuItemFolder: (
    itemId: any,
    realSubItemIndexes: number[],
    realRootItemIndexes: number[]
  ) => void;
  onAddTagItem: (item: TagItem) => void;
  onEditTagItem: (item: TagItem) => void;
}

const ToDoMenu: React.FC<ToDoMenuProps> = (props) => {
  const {
    active,
    onChange,
    tags,
    menu,
    colors,
    onDeleteTagItem,
    onAddTodoMenuItem,
    onEditTodoMenuItem,
    onDeleteTodoMenuItem,
    onAddTodoMenuItemFolder,
    onBreakTodoMenuItemFolder,
    onAddTagItem,
    onEditTagItem,
  } = props;
  const todoMenu = useMemo(() => flatToTree(menu), [menu]);
  const sortedTags = useMemo(
    () => [...tags].sort((a: TagItem, b: TagItem) => a.order - b.order),
    [tags]
  );
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
  //
  const [editTagItemDialogState, setEditTagItemDialogState] = useState<{
    show: boolean;
    id?: string;
  }>({
    show: false,
    id: '',
  });
  const editTagItemForm = useRef<HTMLFormElement>();
  const editTagItemFormDefaultValue = useMemo(
    () =>
      tags.find((item: ListItem) => item.id === editTagItemDialogState.id) ||
      {},
    [editTagItemDialogState.id, tags]
  );
  const editTagItemFormConfirm = useCallback(async () => {
    if ((await editTagItemForm.current?.validate()) === true) {
      onEditTagItem({
        ...tags.find((item: TagItem) => item.id === editTagItemDialogState.id),
        ...editTagItemForm.current?.getFieldsValue(['title', 'color']),
      });
      setEditTagItemDialogState({
        show: false,
      });
    }
  }, [onEditTagItem, tags, editTagItemDialogState.id]);
  //
  const [
    editTodoMenuItemFolderDialogState,
    setEditTodoMenuItemFolderDialogState,
  ] = useState<{
    show: boolean;
    id?: string;
  }>({
    show: false,
    id: '',
  });
  const editTodoMenuItemFolderForm = useRef<HTMLFormElement>();
  const editTodoMenuItemFolderFormDefaultValue = useMemo(
    () =>
      menu.find(
        (item: ListItem) => item.id === editTodoMenuItemFolderDialogState.id
      )?.title,
    [editTodoMenuItemFolderDialogState.id, menu]
  );
  const editTodoMenuItemFolderFormConfirm = useCallback(async () => {
    if ((await editTodoMenuItemFolderForm.current?.validate()) === true) {
      onEditTodoMenuItem(
        {
          ...menu.find(
            (item: ListItem) => item.id === editTodoMenuItemFolderDialogState.id
          ),
          title: editTodoMenuItemFolderForm.current?.getFieldsValue(['title'])
            ?.title,
        },
        todoMenu.realRootItemIndexes,
        todoMenu.realSubItemIndexes.get(
          editTodoMenuItemFolderDialogState.id as string
        ) as number[]
      );
      setEditTodoMenuItemFolderDialogState({
        show: false,
      });
    }
  }, [
    onEditTodoMenuItem,
    menu,
    todoMenu.realRootItemIndexes,
    todoMenu.realSubItemIndexes,
    editTodoMenuItemFolderDialogState.id,
  ]);
  //
  const [editTodoMenuItemDialogState, setEditTodoMenuItemDialogState] =
    useState<{
      show: boolean;
      id?: string;
    }>({
      show: false,
      id: '',
    });
  const editTodoMenuItemForm = useRef<HTMLFormElement>();
  const editTodoMenuItemFormDefaultValue = useMemo(
    () =>
      menu.find(
        (item: ListItem) => item.id === editTodoMenuItemDialogState.id
      ) || {},
    [editTodoMenuItemDialogState.id, menu]
  );
  const editTodoMenuItemFormConfirm = useCallback(async () => {
    if ((await editTodoMenuItemForm.current?.validate()) === true) {
      const idx = menu.findIndex(
        (item: ListItem) => item.id === editTodoMenuItemDialogState.id
      );
      const formFieldsValue = editTodoMenuItemForm.current?.getFieldsValue([
        'title',
        'color',
        'parent',
      ]);
      onEditTodoMenuItem(
        {
          ...menu[idx],
          ...formFieldsValue,
          order:
            menu[idx].parent === formFieldsValue.parent
              ? menu[idx].order
              : getNextOrder(todoMenu.sortedTree, formFieldsValue.parent),
        },
        todoMenu.realRootItemIndexes,
        todoMenu.realSubItemIndexes.get(menu[idx].parent) as number[]
      );
      setEditTodoMenuItemDialogState({
        show: false,
      });
    }
  }, [
    menu,
    onEditTodoMenuItem,
    todoMenu.sortedTree,
    todoMenu.realRootItemIndexes,
    todoMenu.realSubItemIndexes,
    editTodoMenuItemDialogState.id,
  ]);
  const { height: sysTitleBarHeight } = useTitleBarAreaRect();
  const [addTagItemDialogShow, setAddTagItemDialogShow] =
    useState<boolean>(false);
  const onAddTagItemDialogForm = useRef<HTMLFormElement>();
  const onAddTagItemDialogConfirm = useCallback(async () => {
    if ((await onAddTagItemDialogForm.current?.validate()) === true) {
      onAddTagItem({
        id: new Date().getTime().toString(),
        order: getNextOrder(tags),
        ...onAddTagItemDialogForm.current?.getFieldsValue(['color', 'title']),
      });
      setAddTagItemDialogShow(false);
    }
  }, [onAddTagItem, tags]);
  const getRandomColorId = useCallback(() => {
    return Math.floor(Math.random() * colors.length);
  }, [colors]);
  const addTodoMenuItemForm = useRef<HTMLFormElement>();
  const [addTodoMenuItemFolderInputValue, setAddTodoMenuItemFolderInputValue] =
    useState<string>();
  const [
    addTodoMenuItemFormDefaultFolder,
    setAddTodoMenuItemFormDefaultFolder,
  ] = useState<string>('');
  const [
    addTodoMenuItemFolderPopUpVisible,
    setAddTodoMenuItemFolderPopUpVisible,
  ] = useState<boolean>(false);
  const [addTodoMenuItemDialogShow, setAddTodoMenuItemDialogShow] =
    useState<boolean>(false);
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
          order: getNextOrder(todoMenu.sortedTree, ''),
        });
        setAddTodoMenuItemFolderInputValue(() => '');
        if (editTodoMenuItemDialogState.show) {
          editTodoMenuItemForm.current?.setFields([
            { name: 'parent', value: id },
          ]);
        } else if (addTodoMenuItemDialogShow) {
          addTodoMenuItemForm.current?.setFields([
            { name: 'parent', value: id },
          ]);
        }
        setAddTodoMenuItemFolderPopUpVisible(false);
      }
    },
    [
      addTodoMenuItemDialogShow,
      editTodoMenuItemDialogState.show,
      onAddTodoMenuItemFolder,
      todoMenu,
    ]
  );
  const onAddTodoMenuItemDialogConfirm = useCallback(async () => {
    if ((await addTodoMenuItemForm.current?.validate()) === true) {
      const formFieldsValue = addTodoMenuItemForm.current?.getFieldsValue([
        'title',
        'parent',
        'color',
      ]);
      onAddTodoMenuItem({
        id: new Date().getTime().toString(),
        ...formFieldsValue,
        folder: false,
        order: getNextOrder(todoMenu.sortedTree, formFieldsValue.parent),
      });
      setAddTodoMenuItemDialogShow(false);
      setAddTodoMenuItemFormDefaultFolder('');
    }
  }, [onAddTodoMenuItem, todoMenu]);
  const todoMenuFolders = useMemo(
    () => [
      <Option value="-1" disabled>
        <Input
          size="small"
          maxlength={25}
          placeholder="????????????????????????"
          onEnter={addTodoMenuItemFolder}
          value={addTodoMenuItemFolderInputValue}
          onChange={(value) => {
            setAddTodoMenuItemFolderInputValue(value as string);
          }}
        />
      </Option>,
      <HrDivider top={10} bottom={15} />,
      <Option label="???" value="" />,
      ...menu
        .filter((item: ListItem) => item.folder === true)
        .map((item: ListItem) => <Option label={item.title} value={item.id} />),
    ],
    [addTodoMenuItemFolder, addTodoMenuItemFolderInputValue, menu]
  );
  useEffect(() => {
    const editTagItemListener = window.electron.ipcRenderer.on(
      'edit-tagItem-menu',
      (tagId) => {
        setEditTagItemDialogState({ show: true, id: tagId as string });
      }
    ) as () => void;
    const deleteTagItemListener = window.electron.ipcRenderer.on(
      'delete-tagItem-menu',
      (tagId) => {
        // @ts-ignore
        const dialog = DialogPlugin.confirm({
          header: '????????????',
          body: '??????????????????????????????????????????',
          confirmBtn: '??????',
          cancelBtn: '??????',
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
          header: '????????????',
          body: '?????????????????????????????????????????????????????????????????????',
          confirmBtn: '??????',
          cancelBtn: '??????',
          showOverlay: false,
          onConfirm: () => {
            const todoItem: ListItem = menu.find(
              (todo: ListItem) => todo.id === itemId
            );
            onDeleteTodoMenuItem(
              itemId,
              todoItem.parent === ''
                ? todoMenu.realRootItemIndexes
                : (todoMenu.realSubItemIndexes.get(todoItem.parent) as number[])
            );
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
    const editToDoMenuItemListener = window.electron.ipcRenderer.on(
      'edit-toDoMenuItem-menu',
      (itemId) => {
        setEditTodoMenuItemDialogState({
          id: itemId as string,
          show: true,
        });
      }
    ) as () => void;
    const breakToDoMenuItemFolderListener = window.electron.ipcRenderer.on(
      'break-toDoMenuItemFolder-menu',
      (itemId) => {
        // @ts-ignore
        const dialog = DialogPlugin.confirm({
          header: '???????????????',
          body: '????????????????????????????????????????????????????????????????????????',
          confirmBtn: '??????',
          cancelBtn: '??????',
          showOverlay: false,
          onConfirm: () => {
            onBreakTodoMenuItemFolder(
              itemId,
              todoMenu.realSubItemIndexes.get(itemId as string) as number[],
              todoMenu.realRootItemIndexes
            );
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
    const editToDoMenuItemFolderListener = window.electron.ipcRenderer.on(
      'edit-toDoMenuItemFolder-menu',
      (itemId) => {
        setEditTodoMenuItemFolderDialogState({
          id: itemId as string,
          show: true,
        });
      }
    ) as () => void;
    const addToDoMenuItemFolderListener = window.electron.ipcRenderer.on(
      'add-toDoMenuItemFolder-menu',
      (itemId) => {
        setAddTodoMenuItemFormDefaultFolder(itemId as string);
        setAddTodoMenuItemDialogShow(true);
      }
    ) as () => void;
    return () => {
      editTagItemListener();
      deleteTagItemListener();
      deleteToDoMenuItemListener();
      editToDoMenuItemListener();
      breakToDoMenuItemFolderListener();
      editToDoMenuItemFolderListener();
      addToDoMenuItemFolderListener();
    };
  }, [
    onBreakTodoMenuItemFolder,
    onDeleteTagItem,
    onDeleteTodoMenuItem,
    todoMenu.realRootItemIndexes,
    todoMenu.realSubItemIndexes,
    menu,
  ]);
  return (
    <>
      <Dialog
        visible={editTagItemDialogState.show}
        header="????????????"
        confirmBtn="??????"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setEditTagItemDialogState({
            show: false,
          });
        }}
        onConfirm={editTagItemFormConfirm}
      >
        <Form
          ref={(node) => {
            editTagItemForm.current = node;
          }}
          style={{ margin: '10px 0' }}
        >
          <FormItem
            label="??????"
            name="title"
            rules={[
              { message: '????????????????????????', type: 'error', required: true },
            ]}
            initialData={editTagItemFormDefaultValue.title}
          >
            <Input placeholder="??????" />
          </FormItem>
          <FormItem
            label="??????"
            name="color"
            initialData={editTagItemFormDefaultValue.color}
          >
            {
              // @ts-ignore
              React.createElement(ColorPicker, { colors })
            }
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        visible={editTodoMenuItemDialogState.show}
        header="????????????"
        confirmBtn="??????"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setEditTodoMenuItemDialogState({
            show: false,
          });
        }}
        onConfirm={editTodoMenuItemFormConfirm}
      >
        <Form style={{ marginTop: '20px' }} ref={editTodoMenuItemForm}>
          <FormItem
            label="??????"
            name="title"
            rules={[
              { message: '????????????????????????', type: 'error', required: true },
            ]}
            initialData={editTodoMenuItemFormDefaultValue.title}
          >
            <Input placeholder="??????" />
          </FormItem>
          <FormItem
            label="?????????"
            name="parent"
            initialData={editTodoMenuItemFormDefaultValue.parent}
          >
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
          <FormItem
            label="??????"
            name="color"
            initialData={editTodoMenuItemFormDefaultValue.color}
          >
            {
              // @ts-ignore
              React.createElement(ColorPicker, { colors })
            }
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        visible={editTodoMenuItemFolderDialogState.show}
        header="???????????????"
        confirmBtn="??????"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setEditTodoMenuItemFolderDialogState({
            show: false,
          });
        }}
        onConfirm={editTodoMenuItemFolderFormConfirm}
      >
        <Form
          ref={(node) => {
            editTodoMenuItemFolderForm.current = node;
          }}
          style={{ margin: '10px 0' }}
        >
          <FormItem
            name="title"
            rules={[
              { message: '???????????????????????????', type: 'error', required: true },
            ]}
            initialData={editTodoMenuItemFolderFormDefaultValue}
          >
            <Input prefixIcon={<FolderIcon />} placeholder="??????" />
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        visible={addTodoMenuItemDialogShow}
        header="????????????"
        confirmBtn="??????"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setAddTodoMenuItemDialogShow(false);
          setAddTodoMenuItemFormDefaultFolder('');
        }}
        onConfirm={onAddTodoMenuItemDialogConfirm}
      >
        <Form style={{ marginTop: '20px' }} ref={addTodoMenuItemForm}>
          <FormItem
            label="??????"
            name="title"
            rules={[
              { message: '????????????????????????', type: 'error', required: true },
            ]}
          >
            <Input placeholder="??????" />
          </FormItem>
          <FormItem
            label="?????????"
            name="parent"
            initialData={addTodoMenuItemFormDefaultFolder}
          >
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
          <FormItem label="??????" name="color" initialData={getRandomColorId}>
            {
              // @ts-ignore
              React.createElement(ColorPicker, { colors })
            }
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        visible={addTagItemDialogShow}
        header="????????????"
        confirmBtn="??????"
        showOverlay={false}
        destroyOnClose
        onClose={() => {
          setAddTagItemDialogShow(false);
        }}
        onConfirm={onAddTagItemDialogConfirm}
      >
        <Form ref={onAddTagItemDialogForm} style={{ marginTop: '20px' }}>
          <FormItem
            label="??????"
            name="title"
            rules={[
              { message: '????????????????????????', type: 'error', required: true },
            ]}
          >
            <Input placeholder="??????" />
          </FormItem>
          <FormItem label="??????" name="color" initialData={getRandomColorId}>
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
            ??????
          </MenuItem>
          <MenuItem value="recent" icon={<TimeIcon />}>
            ??????7???
          </MenuItem>
          <MenuItem value="new" icon={<RootListIcon />}>
            ?????????
          </MenuItem>
          <MenuItem value="finish" icon={<CheckCircleIcon />}>
            ?????????
          </MenuItem>
          <MenuItem value="trash" icon={<ClearIcon />}>
            ?????????
          </MenuItem>
          <MenuGroup
            title={
              <div className={styles.menuGroupTitleContainer}>
                <span>??????</span>
                {/* <button
                  type="button"
                  onClick={() => {
                    console.log('menu', menu);
                    console.log('tree', todoMenu.sortedTree);
                    console.log('root', todoMenu.realRootItemIndexes);
                    console.log('sub', todoMenu.realSubItemIndexes);
                    console.log('tags', tags);
                  }}
                >
                  debug
                </button> */}
                <AddIcon
                  size="large"
                  style={{ color: 'var(--td-text-color-placeholder)' }}
                  className={`${styles.icon} ${
                    todoMenu.sortedTree.length <= 0 ? styles.active : null
                  }`}
                  onClick={() => {
                    setAddTodoMenuItemDialogShow(true);
                  }}
                />
              </div>
            }
          >
            {todoMenu.sortedTree.map((item) => {
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
                              menu.find((todo: ListItem) => todo.id === active)
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
                <span>??????</span>
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
            {sortedTags.map((item: TagItem) => (
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

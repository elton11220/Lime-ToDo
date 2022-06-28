import React, { useMemo, useState } from 'react';
import { Layout, Menu } from 'tdesign-react';
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
import { connect, ConnectedProps } from 'react-redux';

const { Aside, Content } = Layout;
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

const connector = connect((state: any) => ({
  todoMenu: state.dataReducer.todoMenu,
  tags: state.dataReducer.tags,
}));

const Todos: React.FC<ConnectedProps<typeof connector>> = (props) => {
  const [active, setActive] = useState('');
  const { todoMenu: originTodoMenu, tags } = props;
  const todoMenu = useMemo(() => resolveList(originTodoMenu), [originTodoMenu]);
  return (
    <Layout style={{ height: '100%' }}>
      <Aside>
        <Menu
          value={active}
          onChange={(v: any) => setActive(v)}
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
                  <MenuItem
                    value={item.id}
                    key={item.id}
                    icon={<ViewListIcon />}
                  >
                    {item.title}
                  </MenuItem>
                );
              }
              const children = item.children.map((child) => (
                <MenuItem
                  value={child.id}
                  key={child.id}
                  icon={<ViewListIcon />}
                >
                  {child.title}
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
                {item.title}
              </MenuItem>
            ))}
          </MenuGroup>
        </Menu>
      </Aside>
      <Content>
        <span>123</span>
      </Content>
    </Layout>
  );
};

export default connector(Todos);

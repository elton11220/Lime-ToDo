import React, { useState } from 'react';
import { Menu, Avatar } from 'tdesign-react';
import {
  CheckRectangleFilledIcon,
  CalendarIcon,
  UserCircleIcon,
} from 'tdesign-icons-react';
import styles from './style.module.scss';

const { MenuItem } = Menu;

const SideBar: React.FC = () => {
  const [active, setActive] = useState(0);
  return (
    <Menu
      logo={
        <div className={styles.avatarContainer}>
          <Avatar icon={<UserCircleIcon />} size="38px" />
        </div>
      }
      collapsed
      value={active}
      defaultValue={0}
      onChange={(v: any) => setActive(v)}
    >
      <MenuItem value={0} icon={<CheckRectangleFilledIcon />}>
        待办事项
      </MenuItem>
      <MenuItem value={1} icon={<CalendarIcon />}>
        日历视图
      </MenuItem>
    </Menu>
  );
};

export default SideBar;

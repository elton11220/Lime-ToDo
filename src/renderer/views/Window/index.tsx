import React from 'react';
import { Layout } from 'tdesign-react';
import TitleBar from 'renderer/components/TitleBar';
import SideBar from 'renderer/components/SideBar';
import { Outlet } from 'react-router';
import styles from './style.module.scss';

const { Aside, Content } = Layout;

const Window: React.FC = () => {
  return (
    <div className={styles.container}>
      <TitleBar title="青柠清单" />
      <Layout>
        <Aside width="64px">
          <SideBar />
        </Aside>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default Window;

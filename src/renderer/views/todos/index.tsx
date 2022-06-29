import React, { useState } from 'react';
import { Layout } from 'tdesign-react';
import { connect, ConnectedProps } from 'react-redux';
import ToDoMenu from 'renderer/components/ToDoMenu';
import styles from './style.module.scss';

const { Aside, Content } = Layout;

const connector = connect((state: any) => ({
  todos: state.dataReducer.todoMenu,
  tags: state.dataReducer.tags,
}));

const Todos: React.FC<ConnectedProps<typeof connector>> = (props) => {
  const [active, setActive] = useState('');
  const { todos, tags } = props;
  return (
    <Layout style={{ height: '100%' }}>
      <Aside>
        <ToDoMenu
          active={active}
          onChange={setActive}
          tags={tags}
          todos={todos}
        />
      </Aside>
      <Content>
        <span>123</span>
      </Content>
    </Layout>
  );
};

export default connector(Todos);

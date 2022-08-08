import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Todos from './views/todos';
import Window from './views/Window';
import store from './redux';
import { loadTag, loadTodoMenu } from './redux/slice/dataReducer';
import 'tdesign-react/es/style/index.css';
import db from './utils/db';

export default function App() {
  useEffect(() => {
    db.tag.find({}, (err: any, res: TagItem[]) => {
      if (res.length > 0) {
        store.dispatch(loadTag(res));
      }
    });
    db.todoMenu.find({}, (err: any, res: ListItem[]) => {
      if (res.length > 0) {
        store.dispatch(loadTodoMenu(res));
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Window />}>
            <Route index element={<Todos />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

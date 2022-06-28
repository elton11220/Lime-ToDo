import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import Todos from './views/todos';
import Window from './views/Window';
import store from './redux';

export default function App() {
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

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Todos from './views/todos';
import Window from './views/Window';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Window />}>
          <Route index element={<Todos />} />
        </Route>
      </Routes>
    </Router>
  );
}

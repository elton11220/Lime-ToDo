const DataStore = require('nedb-enhanced');

const tag = new DataStore({
  filename: 'tag',
  autoload: true,
});

const todoMenu = new DataStore({
  filename: 'todoMenu',
  autoload: true,
});

const todoItem = new DataStore({
  filename: 'todoItem',
  autoload: true,
});

const db = {
  tag,
  todoMenu,
  todoItem,
};

export default db;

import path from 'path';
import { app } from '@electron/remote';

const DataStore = require('nedb');

const $tagDb = new DataStore({
  filename: path.join(app.getPath('userData'), '/tag.db'),
  autoload: true,
});

const $todoMenuDb = new DataStore({
  filename: path.join(app.getPath('userData'), '/todoMenu.db'),
  autoload: true,
});

const $todoItemDb = new DataStore({
  filename: path.join(app.getPath('userData'), '/todoItem.db'),
  autoload: true,
});

export { $tagDb, $todoMenuDb, $todoItemDb };

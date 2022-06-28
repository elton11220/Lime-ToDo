import { configureStore } from '@reduxjs/toolkit';

import dataReducer from './slice/dataReducer';

const store = configureStore({
  reducer: {
    dataReducer,
  },
});

export default store;

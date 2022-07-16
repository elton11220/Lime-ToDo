import { configureStore } from '@reduxjs/toolkit';

import dataReducer from './slice/dataReducer';

const store = configureStore({
  reducer: {
    dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export default store;

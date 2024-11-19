import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import projectReducer from './projectSlice';

let storage;

// Check if window is defined (client-side)
if (typeof window !== 'undefined') {
  storage = require('redux-persist/lib/storage').default;
} else {
  storage = require('redux-persist/lib/storage/createWebStorage').default('local');
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, projectReducer);

export const store = configureStore({
  reducer: {
    projects: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

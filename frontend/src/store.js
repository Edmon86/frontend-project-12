import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  devTools: true, // чтобы видеть состояние в Redux DevTools
});

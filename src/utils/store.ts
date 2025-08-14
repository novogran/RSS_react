import { configureStore } from '@reduxjs/toolkit';
import pokemonSelectionReducer from '../components/store/pokemonSelectionSlice';

export const store = configureStore({
  reducer: {
    pokemonSelection: pokemonSelectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

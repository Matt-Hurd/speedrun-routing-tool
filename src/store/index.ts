import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import routesReducer from './routesSlice';
import gamesReducer from './gamesSlice';
import thingsReducer from './thingsSlice';
import progressReducer from './progressSlice';
import userPreferencesReducer from './preferencesSlice';

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    routes: routesReducer,
    games: gamesReducer,
    things: thingsReducer,
    userPreferences: userPreferencesReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('userPreferences', JSON.stringify(store.getState().userPreferences));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

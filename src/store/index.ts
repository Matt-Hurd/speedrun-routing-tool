import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import routesReducer from './routes/routesSlice';
import gamesReducer from './games/gamesSlice';
import thingsReducer from './things/thingsSlice';
import progressReducer from './progress/progressSlice';
import userPreferencesReducer from './preferences/preferencesSlice';

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

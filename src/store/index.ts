import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import routesReducer from "./routesSlice";
import gamesReducer from "./gamesSlice";
import thingsReducer from "./thingsSlice";
import progressReducer from "./progressSlice";
import userPreferencesReducer from "./preferencesSlice";
import notesReducer from "./notesSlice";
import StorageManager from "../utils/StorageManager";
import { createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync } from "redux-state-sync";

const config = {};

export const store = configureStore({
  reducer: withReduxStateSync(
    combineReducers({
      progress: progressReducer,
      routes: routesReducer,
      games: gamesReducer,
      things: thingsReducer,
      userPreferences: userPreferencesReducer,
      notes: notesReducer,
    }),
  ),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createStateSyncMiddleware(config)),
});

initStateWithPrevTab(store);

store.subscribe(() => {
  StorageManager.setItem("userPreferences", JSON.stringify(store.getState().userPreferences));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

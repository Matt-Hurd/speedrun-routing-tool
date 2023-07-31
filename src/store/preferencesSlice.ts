import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import StorageManager from "../utils/StorageManager";

interface UserPreferencesState {
  hideCompletedMarkers: boolean;
}

const savedState = StorageManager.getItem("userPreferences");
const initialState: UserPreferencesState = savedState
  ? JSON.parse(savedState)
  : {
      hideCompletedMarkers: true,
    };

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleHideCompletedMarkers(state) {
      state.hideCompletedMarkers = !state.hideCompletedMarkers;
    },
    setHideCompletedMarkers(state, action: PayloadAction<boolean>) {
      state.hideCompletedMarkers = action.payload;
    },
  },
});

export const { toggleHideCompletedMarkers, setHideCompletedMarkers } = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import StorageManager from '../utils/StorageManager';

interface NoteState {
  pointNotes: Record<string, string>;
  branchNotes: Record<string, string>;
}

const initialState: NoteState = {
  pointNotes: StorageManager.getItem('pointNotes') || {},
  branchNotes: StorageManager.getItem('branchNotes') || {},
};

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    updatePointNote: (state, action: PayloadAction<{ pointId: string; note: string }>) => {
      const { pointId, note } = action.payload;
      state.pointNotes[pointId] = note;
      StorageManager.setItem('pointNotes', state.pointNotes);
    },
    updateBranchNote: (state, action: PayloadAction<{ branchId: string; note: string }>) => {
      const { branchId, note } = action.payload;
      state.branchNotes[branchId] = note;
      StorageManager.setItem('branchNotes', state.branchNotes);
    },
    importNotes: (state, action: PayloadAction<{ pointNotes: Record<string, string>; branchNotes: Record<string, string> }>) => {
      const { pointNotes, branchNotes } = action.payload;
      state.pointNotes = pointNotes;
      state.branchNotes = branchNotes;
      StorageManager.setItem('pointNotes', pointNotes);
      StorageManager.setItem('branchNotes', branchNotes);
    },
  },
});

export const { updatePointNote, updateBranchNote, importNotes } = noteSlice.actions;

export const selectPointNotes = (state: RootState) => state.notes.pointNotes;
export const selectBranchNotes = (state: RootState) => state.notes.branchNotes;

export default noteSlice.reducer;

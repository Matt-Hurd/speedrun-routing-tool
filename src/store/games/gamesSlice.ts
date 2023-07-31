// store/games/gamesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Game } from "../../models";

type GamesState = {
  games: Record<string, Game>;
  status: "idle" | "loading" | 'succeeded' | "failed";
};

const initialState: GamesState = {
  games: {},
  status: "idle",
};

// Thunk action to load games from games.json
export const loadGames = createAsyncThunk("games/loadGames", async () => {
  const response = await fetch("/assets/games.json");
  const games: Game[] = await response.json();
  return games;
});

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadGames.fulfilled, (state, action: PayloadAction<Game[]>) => {
        state.status = "succeeded";
        action.payload.forEach((game) => {
          state.games[game.id] = game;
        });
      })
      .addCase(loadGames.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectGames = (state: RootState) => state.games.games;
export const selectGameById = (state: RootState, gameId: string) =>
  state.games.games[gameId];

export const selectGamesStatus = (state: RootState) => state.games.status;

export default gamesSlice.reducer;

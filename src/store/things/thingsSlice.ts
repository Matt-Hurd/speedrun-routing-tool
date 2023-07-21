import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Thing } from "../../models";

type ThingsState = {
  things: Record<string, Record<string, Thing>>;
  status: "idle" | "loading" | 'succeeded' | "failed";
};

const initialState: ThingsState = {
  things: {},
  status: "idle",
};

export const loadThings = createAsyncThunk("things/loadThings", async (gameId: string) => {
  const response = await fetch(`/assets/${gameId}/things.json`);
  const thingsJson = await response.json();

  const things: Thing[] = thingsJson.map((thingJson: any) => {
    let thing: any = {
      id: thingJson.id,
      name: thingJson.name,
      description: thingJson.description,
      coordinates: thingJson.coordinates,
      layerId: thingJson.layerId,
      dependencyIds: thingJson.dependencyIds,
      icon: thingJson.icon,
    };

    switch (thingJson.type) {
      case "Korok":
        thing.korokSpecificProperty = thingJson.korokSpecificProperty;
        break;
      case "Item":
        thing.itemSpecificProperty = thingJson.itemSpecificProperty;
        break;
      default:
        break;
    }

    return thing;
  });
  return { gameId, things };
});

export const thingsSlice = createSlice({
  name: "things",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadThings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadThings.fulfilled, (state, action: PayloadAction<{ gameId: string; things: Thing[] }>) => {
        state.status = "succeeded";
        const { gameId, things } = action.payload;
        state.things[gameId] = things.reduce((accum, thing) => {
          accum[thing.id] = thing;
          return accum;
        }, {} as Record<string, Thing>);
      })
      .addCase(loadThings.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectThingsForGame = (state: RootState, gameId: string) => state.things.things[gameId] || {};
export const selectThingById = (state: RootState, gameId: string, thingId: string) =>
  state.things.things[gameId]?.[thingId];
  
export const selectThingsStatus = (state: RootState) => state.things.status;

export default thingsSlice.reducer;

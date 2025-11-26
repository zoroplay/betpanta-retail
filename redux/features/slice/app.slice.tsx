import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { InitialAppState } from "../constants/app.constants";
import { GlobalVariables } from "../types/app.types";

const AppSlice = createSlice({
  name: "app",
  initialState: InitialAppState,
  reducers: {
    setTournamentDetails: (
      state,
      {
        payload,
      }: PayloadAction<{
        sport_id?: number;
        category_id?: number;
        tournament_id?: number;
        query?: string;
      }>
    ) => {
      state.tournament_details = {
        ...state.tournament_details,
        sport_id: payload.sport_id ?? state.tournament_details.sport_id,
        category_id:
          payload.category_id ?? state.tournament_details.category_id,
        tournament_id:
          payload.tournament_id ?? state.tournament_details.tournament_id,
        query: payload.query ?? state.tournament_details.query,
      };
    },
    resetQuery: (state) => {
      state.tournament_details.query = "";
    },
    setGlobalVariables: (
      state,
      { payload }: PayloadAction<GlobalVariables>
    ) => {
      state.global_variables = payload;
    },
  },
});

export const { setTournamentDetails, resetQuery, setGlobalVariables } =
  AppSlice.actions;
export default AppSlice.reducer;

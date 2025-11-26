/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialFixturesState } from "../constants/fixtures.constants";
import type { FixturesState, PreMatchFixture } from "../types/fixtures.types";
import type {
  Market,
  OutcomeType,
  SelectedMarket,
} from "../../../data/types/betting.types";
import type { FindCouponData } from "../../services/data/betting.types";
// import {
//   Fixture,
//   OutcomeType,
//   Market,
//   SelectedMarket,
// } from "@/data/types/betting.types";
// import { FixturesState, PreMatchFixture } from "../types/fixtures.types";
// import { FindCouponData } from "@/store/services/data/betting.types";

const fixturesSlice = createSlice({
  name: "fixtures",
  initialState: initialFixturesState,
  reducers: {
    setFixtures: (
      state: FixturesState,
      action: PayloadAction<{
        fixtures: PreMatchFixture[];
        selectedMarket: SelectedMarket[];
        markets: Market[];
        outcomeTypes: OutcomeType[];
      }>
    ) => {
      // console.log("action.ayload.fixtu res:", action.payload.fixtures[0]);
      // console.log(
      //   "action.payload.selectedMarket res:",
      //   action.payload.selectedMarket
      // );
      // console.log("action.payload.markets res:", action.payload.markets[0]);
      // console.log(
      //   "action.payload.outcomeTypes res:",
      //   action.payload.outcomeTypes
      // );
      state.fixtures = action.payload.fixtures;
      state.selectedMarket = action.payload.selectedMarket;
      state.markets = action.payload.markets;
      state.outcomeTypes = action.payload.outcomeTypes;
    },
    setSelectedGame: (
      state: FixturesState,
      action: PayloadAction<PreMatchFixture | null>
    ) => {
      state.selectedGame = action.payload;
    },
    clearSelectedGame: (state: FixturesState) => {
      state.selectedGame = null;
    },
    setCouponData: (
      state: FixturesState,
      action: PayloadAction<FindCouponData | null>
    ) => {
      state.couponData = action.payload;
    },
    clearCouponData: (state: FixturesState) => {
      state.couponData = null;
    },

    updateFixtureOdds: (
      state: FixturesState,
      action: PayloadAction<{
        match_id: string;
        market_id: string;
        outcomes: any[];
      }>
    ) => {
      const { match_id, market_id, outcomes } = action.payload;

      // Find the fixture and update odds
      const fixture = state.fixtures.find((f) => f.matchID === match_id);
      if (fixture) {
        // Update odds in the fixture's markets
        if (state.markets) {
          const market = state.markets.find((m) => m.marketID === market_id);
          if (market && fixture.outcomes) {
            // Update outcomes with new odds
            outcomes.forEach((newOutcome) => {
              const existingOutcome = fixture.outcomes?.find(
                (o) => o.outcomeID === newOutcome.id
              );
              if (existingOutcome) {
                existingOutcome.odds = newOutcome.odds;
                existingOutcome.active = newOutcome.active;
                existingOutcome.status = newOutcome.status;
              }
            });
          }
        }
      }
    },

    updateFixtureMarketStatus: (
      state: FixturesState,
      action: PayloadAction<{
        match_id: string;
        market_id: number;
        status: number;
      }>
    ) => {
      const { match_id, market_id, status } = action.payload;

      // Find the fixture and update market status
      const fixture = state.fixtures.find((f) => f.matchID === match_id);
      if (fixture && state.markets) {
        const market = state.markets.find(
          (m) => m.marketID === market_id.toString()
        );
        if (market) {
          market.status = status;
        }
      }
    },

    updateFixtureOutcome: (
      state: FixturesState,
      action: PayloadAction<{
        matchID: string;
        outcomeID: string;
        updates: {
          odds?: number;
          status?: number;
          active?: boolean;
        };
      }>
    ) => {
      const { matchID, outcomeID, updates } = action.payload;
      const fixture = state.fixtures.find((f) => f.matchID === matchID);

      if (fixture) {
        const outcomeIndex = fixture.outcomes.findIndex(
          (outcome) => outcome.outcomeID === outcomeID
        );

        if (outcomeIndex >= 0) {
          fixture.outcomes.map((outcome) => {
            return {
              ...outcome,
              ...updates,
            };
          });
        }
      }
    },
  },
});

export const {
  setFixtures,
  setSelectedGame,
  clearSelectedGame,
  setCouponData,
  clearCouponData,
  updateFixtureOdds,
  updateFixtureMarketStatus,
  updateFixtureOutcome,
} = fixturesSlice.actions;
export default fixturesSlice.reducer;

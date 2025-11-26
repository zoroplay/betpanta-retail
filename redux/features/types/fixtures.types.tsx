// import {
//   Fixture,
//   Market,
//   OutcomeType,
//   SelectedMarket,
// } from "@/data/types/betting.types";
// import { FindCouponData } from "@/store/services/data/betting.types";

import type {
  Fixture,
  Market,
  OutcomeType,
  SelectedMarket,
} from "../../../data/types/betting.types";
import type { FindCouponData } from "../../services/data/betting.types";

export interface PreMatchFixture extends Fixture {
  event_type: "pre";
}

export interface FixturesState {
  fixtures: PreMatchFixture[];
  selectedMarket: SelectedMarket[];
  markets: Market[];
  outcomeTypes: OutcomeType[];
  selectedGame: PreMatchFixture | null;
  couponData: FindCouponData | null;
}

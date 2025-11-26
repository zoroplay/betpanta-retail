import { useState } from "react";

import { setUserRerender } from "../store/features/slice/user.slice";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../store/services/configs/environment.config";
import { PlaceBetDto } from "../store/services/data/betting.types";
import { CommissionRequest } from "../store/services/types/requests";
import {
  useUserCommissionProfileQuery,
  useCommissionPayoutMutation,
} from "../store/services/user.service";
import { useBetting } from "./useBetting";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { usePlaceBetMutation } from "../store/services/bets.service";

// import { errorToast, successToast } from "@/utils/toast";

interface UsePlaceBetOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const usePlaceBet = (options?: UsePlaceBetOptions) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Modal state
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    currentBalance: 0,
    requiredAmount: 0,
    currency: "",
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [placeBetMutation] = usePlaceBetMutation();
  const { data: commissionData } = useUserCommissionProfileQuery({
    user_id: user?.id!,
    commission_type: "livebet",
  });
  const [commissionPayout] = useCommissionPayoutMutation();

  const {
    selected_bets,
    total_odds,
    potential_winnings,
    stake,
    updateStake,
    clearBets,
  } = useBetting();

  const validateBet = () => {
    // Check if user has any balance first
    if (!user?.availableBalance || user.availableBalance <= 0) {
      setModalData({
        title: "Insufficient Balance",
        message: "Insufficient funds. Please deposit funds into your account.",
        currentBalance: 0,
        requiredAmount: stake,
        currency: user?.currency || "GMD",
      });
      // Small delay to ensure state is properly set
      setTimeout(() => setShowInsufficientBalanceModal(true), 50);
      return false;
    }

    if (!stake || stake <= 0) {
      setModalData({
        title: "Invalid Stake",
        message: "Please enter a valid stake amount",
        currentBalance: user?.availableBalance ?? 0,
        requiredAmount: 0,
        currency: user?.currency || "GMD",
      });
      // Small delay to ensure state is properly set
      setTimeout(() => setShowSuccessModal(true), 50);
      return false;
    }

    if (selected_bets.length === 0) {
      setModalData({
        title: "No Selections",
        message: "Please select at least one bet",
        currentBalance: user?.availableBalance ?? 0,
        requiredAmount: 0,
        currency: user?.currency || "GMD",
      });
      // Small delay to ensure state is properly set
      setTimeout(() => setShowSuccessModal(true), 50);
      return false;
    }

    // Check if user has sufficient balance
    if (stake > (user?.availableBalance ?? 0)) {
      setModalData({
        title: "Insufficient Balance",
        message:
          "You don't have enough funds to place this bet. Please deposit funds into your account.",
        currentBalance: user?.availableBalance ?? 0,
        requiredAmount: stake,
        currency: user?.currency || "GMD",
      });
      // Small delay to ensure state is properly set
      setTimeout(() => setShowInsufficientBalanceModal(true), 50);
      return false;
    }

    return true;
  };

  const buildPlaceBetPayload = (): PlaceBetDto => {
    return {
      clientId: getEnvironmentVariable(
        ENVIRONMENT_VARIABLES.CLIENT_ID!
      ) as unknown as number,
      bet_type: "multiple",
      betslip_type: "multiple",
      channel: "mobile",
      combos: [],
      event_type: "pre",
      exciseDuty: 0,
      fixtures: selected_bets.map((bet) => ({
        eventName: bet.game.event_name,
        eventId: Number(bet.game.event_id),
        type: bet.game.event_type,
        started: bet.game.event_date,
        homeTeam: bet.game.home_team,
        awayTeam: bet.game.away_team,
        producerId: bet.game.producer_id,
        selections: [
          {
            matchId: Number(bet.game?.matchID ?? bet.game?.match_id),
            eventId: Number(bet.game.event_id),
            gameId: Number(bet.game.gameID ?? bet.game?.game_id),
            eventName: bet.game.event_name,
            marketId: bet.game.market_id,
            marketName: bet.game.market_name,
            specifier: bet.game.specifier || "",
            outcomeName: bet.game.outcome_name,
            displayName: bet.game.display_name,
            outcomeId: bet.game.outcome_id,
            odds: bet.game.odds,
            eventDate: bet.game.event_date,
            tournament: bet.game.tournament,
            category: bet.game.category,
            sport: bet.game.sport,
            sportId: bet.game.sport_id,
            type: bet.game.event_type,
            fixed: true,
            combinability: 1,
            selectionId: bet.game.selection_id,
            element_id: String(bet.game.event_id),
            stake: stake,
            homeTeam: bet.game.home_team || "",
            awayTeam: bet.game.away_team || "",
            producerId: bet.game.producer_id || 1,
          },
        ],
      })),
      grossWin: potential_winnings,
      isBooking: 0,
      maxBonus: 0,
      maxOdds: total_odds,
      maxWin: String(potential_winnings),
      minBonus: 0,
      minOdds: total_odds,
      minWin: potential_winnings,
      selections: selected_bets.map((bet) => ({
        matchId: Number(bet.game?.matchID ?? bet.game?.match_id) || 0,
        eventId: Number(bet.game.event_id) || 0,
        gameId: Number(bet.game.gameID ?? bet.game?.game_id) || 0,
        eventName: bet.game.event_name || "",
        marketId: bet.game.market_id || 0,
        marketName: bet.game.market_name || "",
        specifier: bet.game.specifier || "",
        outcomeName: bet.game.outcome_name,
        displayName: bet.game.display_name,
        outcomeId: bet.game.outcome_id,
        odds: bet.game.odds,
        eventDate: bet.game.event_date,
        tournament: bet.game.tournament,
        category: bet.game.category,
        sport: bet.game.sport,
        sportId: bet.game.sport_id,
        type: bet.game.event_type,
        fixed: true,
        combinability: 1,
        selectionId: bet.game.selection_id,
        element_id: String(bet.game.event_id),
        stake: stake,
        homeTeam: bet.game.home_team || "",
        awayTeam: bet.game.away_team || "",
        producerId: bet.game.producer_id || 1,
      })),
      source: "mobile",
      stake: String(stake),
      totalOdds: total_odds,
      totalOdd: String(total_odds.toFixed(2)),
      totalStake: stake,
      tournaments: [],
      userId: user?.id || 0,
      userRole: user?.role || "",
      username: user?.username || "",
      wthTax: 0,
    };
  };

  const buildCommissionRequest = (): CommissionRequest => {
    return {
      userId: user?.id || 0,
      noOfSelections: selected_bets.length,
      provider: "sports",
      stake: stake,
      clientId: getEnvironmentVariable(
        ENVIRONMENT_VARIABLES.CLIENT_ID
      ) as unknown as number,
      totalOdds: Number(total_odds.toFixed(2)),
      commissionId: commissionData?.data?.data?.profile?.id || 0,
      individualOdds: selected_bets.map((bet) => parseFloat(bet.game.odds)),
      individualEventTypes: selected_bets.map((bet) =>
        bet.game.event_type === "pre" ? "prematch" : "live"
      ),
    };
  };

  const placeBet = async () => {
    if (!validateBet()) {
      return;
    }

    try {
      setIsPlacingBet(true);
      const placeBetPayload = buildPlaceBetPayload();

      const result = await placeBetMutation(placeBetPayload).unwrap();

      if (result?.success) {
        // Call commission payout after successful bet placement
        try {
          const commissionRequest = buildCommissionRequest();

          const commissionResult = await commissionPayout(
            commissionRequest
          ).unwrap();

          if (commissionResult?.success) {
          } else {
          }
        } catch (commissionError) {
          // Don't show error to user as bet was already successful
        }

        // Reset betting state
        clearBets();
        updateStake({ stake: 0 });
        setIsConfirming(false);

        // Show success toast
        // successToast({
        //   title: "Bet Placed Successfully",
        //   message: `Your bet has been placed successfully! Stake: ${
        //     user?.currency || "GMD"
        //   } ${stake.toFixed(2)}, Potential Winnings: ${
        //     user?.currency || "GMD"
        //   } ${potential_winnings.toFixed(2)}`,
        // });

        // Comment out modal
        // setModalData({
        //   title: "Bet Placed Successfully",
        //   message: `Your bet has been placed successfully! Stake: ${
        //     user?.currency || "GMD"
        //   } ${stake.toFixed(2)}, Potential Winnings: ${
        //     user?.currency || "GMD"
        //   } ${potential_winnings.toFixed(2)}`,
        //   currentBalance: 0,
        //   requiredAmount: 0,
        //   currency: "",
        // });
        // setTimeout(() => setShowSuccessModal(true), 50);

        // Call success callback if provided
        options?.onSuccess?.();
      } else {
        // Show error toast
        // errorToast({
        //   title: "Error",
        //   message: (result as any)?.message,
        // });
        // Comment out modal
        // setModalData({
        //   title: "Error",
        //   message: "Failed to place bet. Please try again.",
        //   currentBalance: 0,
        //   requiredAmount: 0,
        //   currency: "",
        // });
        // setTimeout(() => setShowSuccessModal(true), 50);
      }
    } catch (error) {
      // Show error toast
      // errorToast({
      //   title: "Error",
      //   message: "Failed to place bet. Please try again.",
      // });

      // Comment out modal
      // setModalData({
      //   title: "Error",
      //   message: "Failed to place bet. Please try again.",
      //   currentBalance: 0,
      //   requiredAmount: 0,
      //   currency: "",
      // });
      // setTimeout(() => setShowSuccessModal(true), 50);

      // Call error callback if provided
      options?.onError?.(error);
    } finally {
      setIsPlacingBet(false);
      dispatch(setUserRerender());
    }
  };

  const confirmBet = () => {
    setIsConfirming(true);
  };

  const cancelBet = () => {
    setIsConfirming(false);
  };

  // Modal handlers
  const closeInsufficientBalanceModal = () => {
    setShowInsufficientBalanceModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleDeposit = () => {
    closeInsufficientBalanceModal();
  };

  return {
    // State
    isConfirming,
    isPlacingBet,

    // Actions
    placeBet,
    confirmBet,
    cancelBet,

    // Validation
    validateBet,

    // Computed values
    canPlaceBet: selected_bets.length > 0 && stake > 0,
    hasSelections: selected_bets.length > 0,
    hasValidStake: stake > 0,

    // Modal state and handlers
    showInsufficientBalanceModal,
    showSuccessModal,
    modalData,
    closeInsufficientBalanceModal,
    closeSuccessModal,
    handleDeposit,

    // Modal components
    // InsufficientBalanceModalComponent: InsufficientBalanceModal,
    // SuccessModalComponent: SuccessModal,
  };
};

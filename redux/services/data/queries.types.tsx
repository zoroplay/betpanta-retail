export interface GetTransactionsDto {
  clientId: string;
  endDate: string;
  page_size: number;
  startDate: string;
  type: string;
  page: number;
  userId: number | null;
}
export interface GetBetListDto {
  betslipId: string;
  clientId: string;
  from: string;
  p: number;
  status: string;
  to: string;
  userId: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    referenceNo: string;
    amount: number;
    balance: number;
    subject: string;
    type: string;
    description: string;
    transactionDate: string;
    channel: string;
    status: number;
    wallet: string;
  }[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
    nextPage: number;
    prevPage: number;
  };
}

export interface GetBetListResponse {
  success: boolean;
  message: string;
  data: {
    tickets: {
      id: string;
      user_id: string;
      username: string;
      betslip_id: string;
      stake: string;
      bet_category: string;
      bet_category_desc: string;
      total_odd: string;
      possible_win: string;
      total_bets: number;
      status: number;
      sports: string;
      tournaments: string;
      events: string;
      created: string;
      statusCode: number;
      selections: {
        eventName: string;
        eventDate: string;
        eventType: string;
        eventPrefix: string;
        eventId: string;
        matchId: string;
        marketName: string;
        specifier: string;
        outcomeName: string;
        odds: string;
        sport: string;
        category: string;
        tournament: string;
        type: string;
        statusDescription: string;
        status: number;
        score: string | null;
        htScore: string | null;
      }[];
      userId: string;
      betslipId: string;
      totalOdd: string;
      possibleWin: string;
      betCategory: string;
      totalSelections: number;
      betCategoryDesc: string;
      cashOutAmount: number;
      pendingGames: string;
    }[];
    totalSales: string;
    totalWon: string | null;
    totalCancelled: number;
    totalSalesNo: number;
    totalCancelledNo: number;
    totalWonNo: number;
    totalRunningNo: number;
    meta: {
      page: number;
      perPage: number;
      total: number;
      lastPage: number | null;
      nextPage: number;
      prevPage: number;
    };
  };
}

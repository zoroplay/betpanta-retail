export const AUTH_ACTIONS = {
  EMAIL_LOGIN: "/auth/login?source=retail",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",
  EMAIL_SIGNUP: "/auth/register",
  AUTH_DETAILS: "/auth/details/:client_id",
  GLOBAL_VARIABLES: "/auth/globalvariables/:client_id",
};

export const NOTIFICATIONS_ACTIONS = {
  SUBSCRIBE: "/notifications/subscribe-expo",
  UNSUBSCRIBE: "/notifications/unsubscribe-expo",
};

export const BETTING_ACTIONS = {
  SPORTS_MENU:
    "sports/menu?period=:period&start=:start_date&end=:end_date&timeoffset=:timeoffset",
  SPORT_CATEGORIES:
    "sports/categories/:sport_id?period=:period&timeoffset=:timeoffset",
  TOURNAMENTS:
    "sports/tournaments/:category_id?period=:period&timeoffset=:timeoffset",
  GET_FIXTURES:
    "/sports/retail/fixtures/:tournament_id?sid=:sport_id&source=web&period=:period&markets=:markets&specifier=:specifier&total=:total&timeoffset=:timeoffset",
  QUERY_FIXTURES:
    "/sports/highlight/prematch/:sport_id?upcoming=:upcoming&markets=:markets&search=:search&timeoffset=:timeoffset",
  GET_FIXTURE:
    "/sports/retail/fixture/:tournament_id?sid=:sport_id&source=web&period=:period&markets=:markets&specifier=:specifier&total=:total&timeoffset=:timeoffset",
  SPORTS_HIGHLIGHT_LIVE:
    "/sports/highlight/live/:sport_id?source=web&markets=:markets",
  GET_SPORT_TOURNAMENTS: "/sports/tournaments/:sport_id",
  FIND_BET: "/bets/find-bet",
  FIND_COUPON: "/bets/find-coupon",
  PLACE_BET: "/bets/place-bet/:client_id?channel=shop",
  GET_TRANSACTIONS: "/user/wallet/transactions?page=:page&limit=:limit",
  GET_BET_LIST: "/retail/:client_id/betlist?page=:page&limit=:limit",
  GET_BET_HISTORY: "/bets/history?page=:page&limit=:limit",
  // Live betting endpoints
  GET_LIVE_EVENTS: "/live/events?sport_id=:sport_id&status=:status",
  GET_LIVE_EVENT_DETAILS: "/live/events/:event_id",
  GET_LIVE_MARKETS: "/live/events/:event_id/markets?market_ids=:market_ids",
  SUBSCRIBE_LIVE_EVENT: "/live/events/:event_id/subscribe",
  UNSUBSCRIBE_LIVE_EVENT: "/live/events/:event_id/unsubscribe",
};

export const CHATS_ACTIONS = {
  CREATE_CHAT: "/chat",
  GET_CHATS: "/chat/chats",
  GET_MESSAGES: "/chat/messages/:chat_id",
  GET_LAST_MESSAGES: "/chat/last-messages?chat_ids=:chat_ids",
  GET_LAST_MESSAGE: "/chat/last-message/:chat_id",
};

export const FILES_ACTIONS = {
  UPLOAD_FILE: "/files/upload",
  UPLOAD_IMAGE: "/files/upload/image",
  UPLOAD_AUDIO: "/files/upload/audio",
  UPLOAD_BASE64: "/files/upload/base64",
  UPLOAD_MULTIPLE_FILES: "/files/upload/multiple",
};

export const USER_ACTIONS = {
  GET_USER: "/user/account",
  GET_USER_CONTACTS: "/user/contacts",
  GET_USER_COMMISSION_BALANCE:
    "/user/wallet/agent/commission-balance/:client_id",
  CREDIT_PLAYER: "/user/wallet/credit-player/:client_id",
  VALIDATE_USER: "/admin/players/search",
  COMMISSION_PAYOUT: "/commission/:client_id/flat-commission-payout",
  COMMISSION_PROFILE: "/user/wallet/agent/commission-balance/:client_id",
  USER_COMMISSION_PROFILE:
    "/commission/one-commission/:user_id?commissionType=:commission_type",
  USER_COMMISSION: "/commission/:client_id/profile/users/:user_id",
  PAYOUT_COMMISSION: "/commission/:client_id/payout-commission",
  DEPOSIT_COMMISSION: "/commission/:client_id/deposit-commission",
  GET_AGENT_USERS: "/retail/:client_id/agent-users?agentId=:agent_id",
};
export const WALLET_ACTIONS = {
  GET_PAYMENT_METHODS: "/user/wallet/:client_id/payment-methods",
  INITIALIZE_TRANSACTION: "/user/wallet/initiate-deposit?source=shop",
  VERIFY_WITHDRAWAL: "/retail/:client_id/wallet/withdraw/validate",
  CREATE_WITHDRAWAL: "/retail/:client_id/wallet/withdraw/transfer",
  CANCEL_WITHDRAWAL: "/user/wallet/cancel-withdrawal/:client_id",
  PENDING_WITHDRAWALS: "/retail/:client_id/wallet/withdraw/pending",
  GET_BANKS: "/user/wallet/:client_id/banks",
  VERIFY_BANK_ACCOUNT: "/user/wallet/verify-bank-account",
  BANK_WITHDRAWAL: "/user/wallet/:client_id/bank-withdrawal",
  TRANSFER_FUNDS: "/retail/:client_id/fund-user",
};

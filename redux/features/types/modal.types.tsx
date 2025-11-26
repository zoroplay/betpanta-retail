/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalState {
  type: ModalType;
  props?: Record<string, any>;
  component_name: string | null; // Component name as string
  dismissible?: boolean;
  closeOnNavigate?: boolean;
  is_open: boolean;
  is_fullscreen_open: boolean; // Separate state for fullscreen modals
  previewImage: boolean;
  title?: string;
  media_urls: string[];
  index: number;
  data_id: string;
}
export const popup = "popup";
export const drawer = "drawer";
export const bottom = "bottom";
export const fullscreen = "fullscreen";

export type ModalType = "popup" | "drawer" | "bottom" | "fullscreen";

export enum ModalFunctionEnum {}
export enum MODAL_COMPONENTS {
  MainSideBar = "MainSideBar",
  ImagePreview = "ImagePreview",
  ImagePreviews = "ImagePreviews",
  CreateChat = "CreateChat",
  ConfirmLogout = "ConfirmLogout",
  CameraScreen = "CameraScreen",
  ChooseMonth = "ChooseMonth",
  ChooseYear = "ChooseYear",
  AddEvent = "AddEvent",
  Menu = "Menu",
  OnlineDeposit = "OnlineDeposit",
  SuccessModal = "SuccessModal",
  InsufficientBalanceModal = "InsufficientBalanceModal",
  NetworkConnection = "NetworkConnection",
  BettingSlip = "BettingSlip",
  // Bottom sheet components converted to fullscreen modals
  MenuBar = "MenuBar",
  SportMenu = "SportMenu",
  GameOptions = "GameOptions",
  CouponDetails = "CouponDetails",
  ONLINE_DEPOSIT = "online-deposit",
  SUCCESS = "success",
  INSUFFICIENT_BALANCE = "insufficient-balance",
  BETTING_SLIP = "betting-slip",
  // Bottom sheet components converted to fullscreen modals
  MENU_BAR = "menu-bar",
  SPORT_MENU = "sport-menu",
  GAME_OPTIONS = "game-options",
  COUPON_DETAILS = "coupon-details",
  CONFIRM_LOGOUT = "confirm-logout",
  CHANGE_PASSWORD = "change-password",
}

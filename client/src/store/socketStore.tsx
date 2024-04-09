import { create } from "zustand";

type TSocketStoreActions = {
  setIsOpponentReady: (isReady: boolean) => void;
  setPlayer1: (id: string) => void;
  setPlayer2: (id: string | null) => void;
  setRoomId: (id: string | null) => void;
};

type TSocketStore = {
  player1: string | null;
  player2: string | null;
  roomId: string | null;
  isOpponentReady: boolean;
  actions: TSocketStoreActions;
};

const useSocketStore = create<TSocketStore>((set) => ({
  player1: null,
  player2: null,
  roomId: null,
  isOpponentReady: false,
  actions: {
    setPlayer1: (id: string) => set({ player1: id }),
    setPlayer2: (id: string | null) => set({ player2: id }),
    setRoomId: (id: string | null) => set({ roomId: id }),
    setIsOpponentReady: (isOpponentReady: boolean) => set({ isOpponentReady }),
  },
}));

export default useSocketStore;

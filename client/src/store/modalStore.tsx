import { create } from "zustand";

type TModalStore = {
  modalMsg: string;
  buttonText: string;
  modalHeader: string;
  isBtnClicked: boolean;
  isConfirmModalOpen: boolean;
  actions: {
    setButtonText: (txt: string) => void;
    setIsBtnClicked: (val: boolean) => void;
    setModalMsg: (msg: string) => void;
    setModalHeader: (head: string) => void;
    triggerConfirmModalOpen: () => void;
  };
};

const useModalStore = create<TModalStore>((set) => ({
  modalMsg: "",
  modalHeader: "",
  buttonText: "",
  isBtnClicked: false,
  isConfirmModalOpen: false,
  actions: {
    setIsBtnClicked: (isBtnClicked: boolean) => set({ isBtnClicked }),
    setModalMsg: (modalMsg: string) => set({ modalMsg }),
    setModalHeader: (modalHeader: string) => set({ modalHeader }),
    setButtonText: (buttonText: string) => set({ buttonText }),
    triggerConfirmModalOpen: () =>
      set((state) => ({ isConfirmModalOpen: !state.isConfirmModalOpen })),
  },
}));

export default useModalStore;

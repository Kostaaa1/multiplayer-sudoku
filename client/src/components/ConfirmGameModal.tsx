import { FC } from "react";
import Confetti from "react-confetti";
import useSocketStore from "../store/socketStore";
import useGameStateStore from "../store/gameStateStore";
import { useSocket } from "../context/SocketProvider";
import { cn } from "../utils/utils";
import useModalStore from "../store/modalStore";
import { generateSudokuBoard } from "../utils/generateSudoku";

interface ModalProps {}

const ConfirmGameModal: FC<ModalProps> = () => {
  const isWinner = useGameStateStore((state) => state.isWinner);
  const roomId = useSocketStore((state) => state.roomId);
  const socket = useSocket();
  const player1 = useSocketStore((state) => state.player1);
  const player2 = useSocketStore((state) => state.player2);
  const { setPlayer2, setRoomId } = useSocketStore((state) => state.actions);
  const difficulty = useGameStateStore((state) => state.difficulty);
  const { triggerConfirmModalOpen } = useModalStore((state) => state.actions);

  const confirmRequest = () => {
    socket?.emit("joinRoom", roomId);
    socket?.emit("roomMessage", {
      player1,
      player2,
      roomId,
      board: JSON.stringify(generateSudokuBoard(difficulty)),
      difficulty,
    });
    triggerConfirmModalOpen();
  };

  const cancelRequest = () => {
    setRoomId(null);
    setPlayer2(null);
    triggerConfirmModalOpen();
  };

  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-70 text-black">
      <div className="flex h-max  w-[420px] flex-col items-center justify-between rounded-md bg-white p-2">
        <h4 className="w-2/3 py-4 text-center font-semibold">
          Player
          <span className="font-bold text-slate-400 underline">{` ${player2} `}</span>
          sent you a request to play a game. Confirm?
        </h4>
        <div className="flex w-full flex-col items-center justify-center">
          <button
            onClick={confirmRequest}
            className={cn(
              "block h-max w-full items-center justify-center bg-slate-400 font-semibold text-white transition-colors duration-200 hover:bg-blue-500",
            )}
          >
            Confirm
          </button>
          <button
            onClick={cancelRequest}
            className={cn(
              "block h-max w-full items-center justify-center bg-slate-400 font-semibold text-white transition-colors duration-200 hover:bg-red-500",
            )}
          >
            Cancel
          </button>
        </div>
      </div>
      {isWinner && <Confetti />}
    </div>
  );
};

export default ConfirmGameModal;

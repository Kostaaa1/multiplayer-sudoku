import { useEffect, useMemo, useRef } from "react";
import useCountdownStore from "../store/countdownStore";
import useSocketStore from "../store/socketStore";
import useMistakesStore from "../store/mistakesStore";
import useToastStore from "../store/toastStore";
import useSudokuStore from "../store/sudokuStore";
import useGameStateStore from "../store/gameStateStore";
import { useInvalidCells } from "../store/cellStore";
import { useSocket } from "../context/SocketProvider";
import booPath from "../assets/boo.mp3";
import hornPath from "../assets/horn.mp3";

const useEndGameConditions = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const player2 = useSocketStore((state) => state.player2);
  const mistakes = useMistakesStore((state) => state.mistakes);

  const isCountdownActive = useCountdownStore(
    (state) => state.isCountdownActive,
  );
  const { setIsCountdownActive } = useCountdownStore((state) => state.actions);
  const isToastRan = useToastStore((state) => state.isToastRan);
  const { callSuccessToast, callErrorToast } = useToastStore(
    (state) => state.actions,
  );
  const invalidCells = useInvalidCells();
  const sudoku = useSudokuStore((state) => state.sudoku);
  const isWinner = useGameStateStore((state) => state.isWinner);
  const { setIsWinner } = useGameStateStore((state) => state.actions);
  const socket = useSocket();

  //////////////////////////////////////
  const allCellsFilled = useMemo(() => {
    return sudoku?.flat().every((x) => x !== "");
  }, [sudoku]);
  //////////////////////////////////////

  ///// Winning/Losing conditions: /////
  useEffect(() => {
    if (allCellsFilled && mistakes < 5 && invalidCells.length === 0)
      setIsWinner(true);
  }, [allCellsFilled]);

  useEffect(() => {
    if (mistakes === 5) setIsWinner(false);
  }, [mistakes]);

  useEffect(() => {
    if (audioRef.current && !isCountdownActive) {
      audioRef.current.volume = 0.1;
      audioRef.current.src = booPath;
      audioRef.current.play();
      callErrorToast(false, "Game over. You ran out of time!");
    }
  }, [isCountdownActive]);

  useEffect(() => {
    if (
      !isCountdownActive ||
      isWinner === null ||
      isToastRan ||
      !audioRef.current
    )
      return;
    setIsCountdownActive(false);
    if (audioRef.current && isWinner === false) {
      audioRef.current.volume = 0.1;
      audioRef.current.src = booPath;
      audioRef.current.play();
      callErrorToast(isWinner, "You have made 5 mistakes, you lost! Try Again");

      socket?.emit("endGame", {
        player: player2,
        isWinner: !isWinner,
        message: "Youu won! The opponent made 5 mistakes!",
      });
    }

    if (audioRef.current && isWinner) {
      audioRef.current.volume = 0.1;
      audioRef.current.src = hornPath;
      audioRef.current.play();

      callSuccessToast(isWinner, "You Won!!!");
      socket?.emit("endGame", {
        player: player2,
        isWinner: !isWinner,
        message: "You lost. The opponent solved before you!",
      });
    }
  }, [isWinner, isToastRan, isCountdownActive]);

  return { audioRef, isToastRan };
};

export default useEndGameConditions;

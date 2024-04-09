import { FC, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import useKeyboardArrows from "../hooks/useKeyboardArrows";
import useSocketStore from "../store/socketStore";
import useGameStateStore from "../store/gameStateStore";
import useCountdownStore from "../store/countdownStore";
import { DifficultySet } from "../types/types";
import Board from "../components/Board";
import Footer from "../components/Footer";
import { Header } from "../components/Headers";

export interface SudokuProps {
  setAll: (mainGame: string) => void;
  startNewGame: (diff: DifficultySet["data"], sudoku?: string[][]) => void;
}

const Sudoku: FC<SudokuProps> = ({ setAll, startNewGame }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const roomId = useSocketStore((state) => state.roomId);
  const isWinner = useGameStateStore((state) => state.isWinner);
  const difficulty = useGameStateStore((state) => state.difficulty);
  const isCountdownActive = useCountdownStore(
    (state) => state.isCountdownActive,
  );
  useKeyboardArrows(inputRefs);

  useEffect(() => {
    if (!roomId) {
      const cachedGameData = localStorage.getItem("main_game");
      if (cachedGameData) {
        setAll(cachedGameData);
        return;
      }
      if (!difficulty || isWinner !== null) return;
      startNewGame(difficulty);
    }
  }, [difficulty, roomId]);

  return (
    <main className="flex w-full items-center justify-center font-semibold">
      <div>
        <Header startNewGame={startNewGame} />
        <Board inputRefs={inputRefs} />
        <Footer />
      </div>
      {!isCountdownActive && isWinner !== null && (
        <Modal startNewGame={startNewGame} />
      )}
    </main>
  );
};

export default Sudoku;

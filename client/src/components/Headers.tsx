import { FC } from "react";
import { SudokuProps } from "../pages/Sudoku";
import DifficultyDropdown from "./DifficultyDropdown";
import Countdown from "./Countdown";

export const Header: FC<{ startNewGame: SudokuProps["startNewGame"] }> = ({
  startNewGame,
}) => {
  return (
    <div className="flex h-max w-full items-center justify-between pb-1">
      <DifficultyDropdown />
      <Countdown startNewGame={startNewGame} />
    </div>
  );
};

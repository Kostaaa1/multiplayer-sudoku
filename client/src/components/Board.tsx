import React, { FC, useEffect } from "react";
import useSudokuStore from "../store/sudokuStore";
import Cell from "./Cell";
import {
  useAnimationValues,
  useAnimationValuesActions,
} from "../store/animationStore";
import { useFocusedCell } from "../store/cellStore";

interface BoardProps {
  inputRefs: React.MutableRefObject<HTMLInputElement[]>;
}

const Board: FC<BoardProps> = ({ inputRefs }) => {
  const sudoku = useSudokuStore((state) => state.sudoku);
  const { resetAnimationValues } = useAnimationValuesActions();
  const animationValues = useAnimationValues();
  const focusedCell = useFocusedCell();

  ////////////////////////////////////
  //////////// Animation: ////////////
  ////////////////////////////////////
  useEffect(() => {
    if (animationValues.length === 0) return;
    console.log(focusedCell);
    const { col, row, value } = focusedCell;
    if (value === "") return;

    const delay = 0.08;
    const addAnimationToCell = (cellId: number, delayMultiplier: number) => {
      const inputRef = inputRefs.current[cellId];
      inputRef.style.animationDelay = "";

      inputRef.classList.remove("animate-wave");
      void inputRef.offsetWidth;
      inputRef.classList.add("animate-wave");

      inputRef.style.animationDelay = `${delayMultiplier}s`;
    };

    if (animationValues.includes("row")) {
      for (let i = 0; i < 9; i++) {
        const rowDelay = Math.abs(col - i) * delay;
        addAnimationToCell(row * 9 + i, rowDelay);
      }
    }

    if (animationValues.includes("col")) {
      for (let i = 0; i < 9; i++) {
        const colDelay = Math.abs(row - i) * delay;
        addAnimationToCell(i * 9 + col, colDelay);
      }
    }

    if (animationValues.includes("grid")) {
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          const gridDelay = (Math.abs(col - j) + Math.abs(row - i)) * delay;
          addAnimationToCell(i * 9 + j, gridDelay);
        }
      }
    }
    resetAnimationValues();
  }, [animationValues]);

  return (
    <div className="board relative flex flex-col items-center justify-center overflow-hidden border-2 border-gray-700 bg-white text-3xl max-[370px]:text-2xl max-[340px]:text-xl">
      {sudoku?.map((rowVal, rowId) => (
        <div key={rowId} className="flex h-full w-full">
          {rowVal.map((colVal, colId) => (
            <Cell
              key={colId}
              rowId={rowId}
              colId={colId}
              colVal={colVal}
              cellRef={(el: HTMLInputElement) =>
                (inputRefs.current[rowId * 9 + colId] = el!)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

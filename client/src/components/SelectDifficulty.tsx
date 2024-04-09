import { useEffect, useState } from "react";
import useGameStateStore from "../store/gameStateStore";
import { DifficultySet } from "../types/types";
import { cn } from "../utils/utils";

export const SelectDifficulty = () => {
  const difficulty = useGameStateStore((state) => state.difficulty);
  const { setDifficulty } = useGameStateStore((state) => state.actions);
  const [difficultyData, setDifficultyData] = useState<DifficultySet[]>([
    { id: 0, type: "difficulty", data: "easy", clicked: true },
    { id: 1, type: "difficulty", data: "medium", clicked: false },
    { id: 2, type: "difficulty", data: "hard", clicked: false },
  ]);

  useEffect(() => {
    setDifficultyData((state) =>
      state.map((x) => ({ ...x, clicked: difficulty === x.data })),
    );
  }, [difficulty]);

  const difficultyBtnClick = (id: number) => {
    const selectedDif = difficultyData.find((x) => x.id === id);
    if (selectedDif) {
      setDifficulty(selectedDif.data);
    }
    setDifficultyData((state) =>
      state.map((x) => ({ ...x, clicked: x.id === id })),
    );
  };

  return (
    <div className="my-2 flex w-full justify-between">
      {difficultyData.map((x, id) => (
        <button
          key={x.id}
          onClick={() => difficultyBtnClick(x.id)}
          className={cn(
            "w-full bg-slate-400 text-sm text-white transition-all duration-200 hover:bg-green-600",
            id % 2 !== 0 && "mx-2",
            x.clicked && "bg-green-600",
          )}
        >
          {x.data.charAt(0).toUpperCase() + x.data.slice(1)}
        </button>
      ))}
    </div>
  );
};

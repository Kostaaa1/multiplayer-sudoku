import { Route, Routes, useNavigate } from "react-router-dom";
import Sudoku from "./pages/Sudoku";
import Modes from "./pages/Modes";
import SocketConnection from "./pages/SocketConnection";
import toast, { Toaster } from "react-hot-toast";
import { useCallback, useEffect } from "react";
import useCountdownStore from "./store/countdownStore";
import useGameStateStore from "./store/gameStateStore";
import useSocketStore from "./store/socketStore";
import useSudokuStore from "./store/sudokuStore";
import useEndGameConditions from "./hooks/useEndGameConditions";
import booPath from "./assets/boo.mp3";
import hornPath from "./assets/horn.mp3";
import { useSocket } from "./context/SocketProvider";
import { generateSudokuBoard } from "./utils/generateSudoku";
import { DifficultySet, TUnifiedGame } from "./types/types";
import useToastStore from "./store/toastStore";
import { countdownSet, emptySudoku } from "./store/constants";
import {
  useInsertedCellsActions,
  useInvalidCellsActions,
  useSingleCellActions,
} from "./store/cellStore";
import useMistakesStore from "./store/mistakesStore";
import useModalStore from "./store/modalStore";
import ConfirmGameModal from "./components/ConfirmGameModal";

function App() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { audioRef } = useEndGameConditions();
  const { decrementTime } = useCountdownStore((state) => state.actions);
  const { setSudoku } = useSudokuStore((state) => state.actions);
  const isConfirmModalOpen = useModalStore((state) => state.isConfirmModalOpen);
  const { setIsWinner, setDifficulty } = useGameStateStore(
    (state) => state.actions,
  );
  const { setIsCountdownActive, setTime, updateCountdown } = useCountdownStore(
    (state) => state.actions,
  );
  const player1 = useSocketStore((state) => state.player1);
  const { setIsOpponentReady, setPlayer1, setPlayer2, setRoomId } =
    useSocketStore((state) => state.actions);
  // const { callSuccessToast, callErrorToast } = useToastStore(
  //   (state) => state.actions,
  // );
  const { setInvalidCells, resetInvalidCells } = useInvalidCellsActions();
  const { setMistakes, resetMistakes } = useMistakesStore(
    (state) => state.actions,
  );
  const { setInsertedCells, resetInsertedCells } = useInsertedCellsActions();
  const { setFocusedCell } = useSingleCellActions();
  // const { setIsToastRan } = useToastStore((state) => state.actions);
  const { triggerConfirmModalOpen } = useModalStore((state) => state.actions);

  const setAll = (mainGame: string) => {
    const parsedData: TUnifiedGame = JSON.parse(mainGame);
    const { time, insertedCells, invalidCells, isWinner, mistakes, sudoku } =
      parsedData;

    updateCountdown(time);
    setInvalidCells(invalidCells);
    setInsertedCells(insertedCells);
    setIsWinner(isWinner);
    setSudoku(sudoku);
    setMistakes(mistakes);
    setFocusedCell({ row: 0, col: 0, value: sudoku[0][0] });
  };

  const resetGameState = (difficulty: DifficultySet["data"]) => {
    localStorage.removeItem("main_game");
    // setIsToastRan(false);
    setIsCountdownActive(true);
    setIsOpponentReady(false);
    resetMistakes();
    resetInsertedCells();
    resetInvalidCells();
    setTime(difficulty);
    setIsWinner(null);
  };

  const getEmptyUnifiedGame = useCallback(
    (difficulty: DifficultySet["data"]) => {
      const emptyGame: TUnifiedGame = {
        sudoku: emptySudoku,
        insertedCells: [],
        invalidCells: [],
        isWinner: null,
        mistakes: 0,
        time: countdownSet[difficulty],
      };
      return emptyGame;
    },
    [],
  );

  const startNewGame = (diff: DifficultySet["data"], sudoku?: string[][]) => {
    resetGameState(diff);
    const emptyGame = getEmptyUnifiedGame(diff);
    const newGame = sudoku || generateSudokuBoard(diff);
    setAll(JSON.stringify({ ...emptyGame, sudoku: newGame }));
  };

  useEffect(() => {
    if (!socket || !player1) return;
    socket.on(
      "message",
      (data: {
        player1: string;
        player2: string;
        board: string;
        roomId: string;
        difficulty: any;
      }) => {
        const { board, difficulty } = data;

        setPlayer2(player1 === data.player1 ? data.player2 : data.player1);
        resetGameState(difficulty);
        setSudoku(JSON.parse(board));
        setDifficulty(difficulty);
        setTime(difficulty);

        navigate("/sudoku");
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [socket, player1]);

  useEffect(() => {
    if (!socket) return;
    socket.on("clientId", (id) => setPlayer1(id));
    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on(
      "notify",
      (data: {
        player1: string;
        player2: string;
        roomId: string;
        difficulty: any;
      }) => {
        const { difficulty, player1, roomId } = data;
        setPlayer2(player1);
        setRoomId(roomId);
        setDifficulty(difficulty);
        triggerConfirmModalOpen();
      },
    );

    socket.on("countdown", decrementTime);
    socket.on(
      "endGame",
      (data: { player: string; message: string; isWinner: boolean }) => {
        const { isWinner  } = data;
        setIsWinner(isWinner);
        // setIsCountdownActive(false);
        // isWinner
        //   ? callSuccessToast(isWinner, message)
        //   : callErrorToast(isWinner, message);
      },
    );

    socket.on("userDisconnected", (msg: string) => {
      setRoomId(null);
      toast.error(`⚠️⚠️⚠️ ${msg} ⚠️⚠️⚠️`);
    });

    socket.on("isOpponentReady", () => {
      setIsOpponentReady(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <div className="flex h-[100svh] w-screen items-center justify-center">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Modes />} />
          <Route path="/sudoku/peer-connect" element={<SocketConnection />} />
          <Route
            path="/sudoku"
            element={<Sudoku startNewGame={startNewGame} setAll={setAll} />}
          />
        </Routes>
      </div>
      <audio ref={audioRef} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="width: 200px"
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            fontWeight: "bold",
            color: "white",
            maxWidth: "100%",
          },
          error: {
            style: {
              background: "#ef4443",
            },
          },
          success: {
            style: {
              background: "#00ba0fac",
            },
          },
        }}
      />
      {isConfirmModalOpen && <ConfirmGameModal />}
    </>
  );
}

export default App;

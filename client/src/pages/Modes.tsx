import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modes = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    const res = await axios.get("https://p2p-sudoku-server.onrender.com/");
    console.log(res.data);

    const { data } = await axios.get(
      "https://p2p-sudoku-server.onrender.com/test",
    );
    console.log("Tst", data);
  };

  return (
    <div className="flex flex-col items-center justify-center font-semibold">
      <div className="border-1 flex h-max w-96 flex-col items-center justify-center border border-gray-200 p-4 shadow-md shadow-gray-400">
        <div className="w-full">
          <div className="test-div">
            <button onClick={handleClick}>Click TO Fetch</button>
          </div>
          <div className="mb-2 flex h-12 items-center justify-center text-3xl font-bold italic text-blue-600 underline">
            Sudoku
          </div>
          <div className="flex w-full justify-between">
            <button
              onClick={() => navigate("/sudoku")}
              className="mr-2 w-full bg-blue-600"
            >
              Singleplayer
            </button>
            <button
              onClick={() => navigate("/sudoku/peer-connect")}
              className="w-full bg-green-600"
            >
              Multiplayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modes;

import useSocketStore from "../store/socketStore";
import useMistakesStore from "../store/mistakesStore";

const Footer = () => {
  const player1 = useSocketStore((state) => state.player1);
  const player2 = useSocketStore((state) => state.player2);
  const roomId = useSocketStore((state) => state.roomId);
  const mistakes = useMistakesStore((state) => state.mistakes);

  return (
    <>
      <div className="flex w-full items-center justify-between tracking-tighter text-black max-[340px]:text-xs">
        <span className="flex ">
          My Id:
          <p className="ml-2 text-yellow-600">{player1}</p>
        </span>
        <span className="flex">
          Mistakes:
          <p className="ml-2">{`${mistakes}/5`}</p>
        </span>
      </div>
      {roomId && (
        <span className="flex w-full text-sm tracking-tighter text-black">
          Connected to:
          <p className="ml-2 text-yellow-600">{player2}</p>
        </span>
      )}
    </>
  );
};

export default Footer;

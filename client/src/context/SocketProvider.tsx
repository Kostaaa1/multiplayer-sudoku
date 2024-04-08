import { ReactNode, createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined,
);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const URL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_REACT_APP_BACKEND_URL
      : undefined;

  const socket = io(URL, {
    transports: ["websocket"],
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext)?.socket;
};

import { Socket } from "socket.io-client";

interface TerminalsProps {
  socket: Socket;
}

const Terminals = ({ socket }: TerminalsProps) => {
  return <div>Terminals</div>;
};

export default Terminals;

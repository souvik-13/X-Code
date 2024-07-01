import { Socket } from "socket.io-client";

interface OutputsProps {
  socket: Socket;
}

const Outputs = ({ socket }: OutputsProps) => {
  return <div>Outputs</div>;
};

export default Outputs;

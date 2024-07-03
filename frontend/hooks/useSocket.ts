// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";


// export const useSocket = ({ playgroundId }: {
//   playgroundId: string;
// }) => {
//   const [socket, setSocket] = useState<Socket>();
//   useEffect(() => {
//     const newSocket = io("http://localhost:8080");
//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//       setSocket(undefined);
//     };
//   }, []);

//   return socket;
// };

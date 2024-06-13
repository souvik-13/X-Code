
import express from "express";
import { createServer } from "http";
import cors from "cors";

// import WebSocketService from "./services/websocket";
import SocketService from "./services/socket";
import TerminalService from "./services/terminal";
// import AwsService from "./services/aws";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
const httpServer = createServer(app);


const socketService = new SocketService(httpServer);
// const wsService = new WebSocketService(8081);

const port = process.env.PORT || 8081;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});


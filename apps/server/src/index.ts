import express from "express";
import cors from "cors";
import http from "http";
import colyseus from "colyseus";
const { Server } = colyseus;
import wsTransport from "@colyseus/ws-transport";
const { WebSocketTransport } = wsTransport;
import { DailyLedgerRoom } from "./room.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const gameServer = new Server({
    transport: new WebSocketTransport({
        server
    })
});

gameServer.define("daily_ledger", DailyLedgerRoom);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 2567;
gameServer.listen(port).then(() => {
    console.log(`[Colyseus] Game server listening on ws://localhost:${port}`);
});

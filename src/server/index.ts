import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import WebSocket from "ws";
import Game from "./game";
import * as http from "http";
import ClientMessage from "shared/ClientMessage";
import ClientMessageType from "shared/ClientMessageType";

const socket = new WebSocket.Server({ port: 4001 });
const game = new Game();
let clients: WebSocket[] = [];

socket.addListener(
	"connection",
	// Declaring the types because the type definitions are wrong. This may be
	// removed once the type definitions are updated.
	// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52562
	(client: WebSocket, req: http.IncomingMessage) => {
		client.addListener("close", () => {
			console.log("Disconnected: " + req.connection.remoteAddress);

			clients = clients.filter((c) => c !== client);
		});
		client.addListener("message", (raw) => {
			const msg: ClientMessage = JSON.parse(raw.toString());

			if (msg.type === ClientMessageType.Move) {
				game.moveActiveTetromino(msg.dir);
				game.emit("change");
			} else if (msg.type === ClientMessageType.Rotate) {
				game.rotateActiveTetromino();
				game.emit("change");
			}
		});

		clients.push(client);
		console.log("Connected: " + req.connection.remoteAddress);

		const m: ServerMessage = {
			type: ServerMessageType.Board,
			board: game.getBoard(),
		};
		client.send(JSON.stringify(m));

		game.addListener("change", () => {
			const m: ServerMessage = {
				type: ServerMessageType.Board,
				board: game.getBoard(),
			};
			client.send(JSON.stringify(m));
		});
		// if (clients.length === 2) {
		// 	broadcast({ type: MessageType.Start });
		// }
	}
);

// function broadcast(m: Message) {
// 	for (const client of clients) client.send(JSON.stringify(m));
// }

import ServerMessageType from "shared/ServerMessageType";
import Game from "./game";
import ClientMessageType from "shared/ClientMessageType";
import Connection from "./connection/Connection";
import WebSocketConnection from "./connection/WebSocketConnection";
import Client from "./connection/Client";

const connection: Connection = new WebSocketConnection();
const games = new Map<Client, Game>();

connection.addListener("connect", (client) => {
	const game = new Game();

	game.addListener("change", () =>
		client.send({ board: game.getBoard(), type: ServerMessageType.Board })
	);

	games.set(client, game);
});
connection.addListener("disconnect", (client) => {
	games.delete(client);
});
connection.addListener("message", (client, message) => {
	const game = games.get(client);

	if (!game)
		throw new Error(`Could not find game for client with ip ${client.ip}`);

	if (message.type === ClientMessageType.Move) {
		game.moveActiveTetromino(message.dir);
		game.emit("change");
	} else if (message.type === ClientMessageType.Rotate) {
		game.rotateActiveTetromino();
		game.emit("change");
	}
});

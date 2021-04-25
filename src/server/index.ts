import ServerMessageType from "shared/ServerMessageType";
import GameLogic from "./game/GameLogic";
import ClientMessageType from "shared/ClientMessageType";
import Connection from "./connection/Connection";
import WebSocketConnection from "./connection/WebSocketConnection";
import Client from "./connection/Client";

const connection: Connection = new WebSocketConnection();
const games = new Map<Client, GameLogic>();

connection.addListener("connect", (client) => {
	createGameFor(client);
});
connection.addListener("disconnect", (client) => {
	const game = games.get(client);

	if (game) {
		games.delete(client);
		game.stopGame();
	}
});
connection.addListener("message", (client, message) => {
	const game = games.get(client);

	if (!game)
		throw new Error(`Could not find game for client with ip ${client.ip}`);

	if (message.type === ClientMessageType.Move) {
		game.moveActiveTetromino(message.dir);
		game.emit("change");
	} else if (message.type === ClientMessageType.Restart) {
		for (const player of Array.from(games.keys())) {
			const oldGame = games.get(player);

			if (oldGame) {
				oldGame.stopGame();

				createGameFor(player);
			}
		}
	} else if (message.type === ClientMessageType.Rotate) {
		game.rotateActiveTetromino();
		game.emit("change");
	}
});

function createGameFor(c: Client) {
	const game = new GameLogic();

	games.set(c, game);

	if (games.size > 2) throw new Error("Only two players supported right now");

	game.addListener("change", () => {
		const board = game.getBoard();

		c.send({ board, type: ServerMessageType.YourBoard });

		for (const player of Array.from(games.keys())) {
			if (player !== c) {
				player.send({
					type: ServerMessageType.OpponentBoard,
					board,
					opponentId: player.uuid,
				});
			}
		}
	});
}

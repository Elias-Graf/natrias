import ServerMessageType from "shared/ServerMessageType";
import GameLogic from "./game/GameLogic";
import Connection from "./connection/Connection";
import WebSocketConnection from "./connection/WebSocketConnection";
import Client from "./connection/Client";
import ClientMessageType from "shared/ClientMessageType";

const connection: Connection = new WebSocketConnection();
const games = new Map<Client, GameLogic>();

connection.addListener("connect", () => {
	if (connection.clients.length !== 2) return;

	createAndStartGames();
});
connection.addListener("disconnect", () => {
	stopAllGames();
});
connection.addListener("message", (client, message) => {
	const game = games.get(client);

	if (!game)
		throw new Error(`Could not find game for client with ip ${client.ip}`);

	if (message.type === ClientMessageType.Move) {
		game.moveActiveTetromino(message.dir);
		game.emit("change");
	} else if (message.type === ClientMessageType.Restart) {
		stopAllGames();
		createAndStartGames();
	} else if (message.type === ClientMessageType.Rotate) {
		game.rotateActiveTetromino();
		game.emit("change");
	}
});

function createAndStartGames() {
	const { clients } = connection;

	for (const player of clients) {
		const game = new GameLogic();

		games.set(player, game);

		game.start();
	}

	for (const player of clients) {
		const opponent = clients.find((_) => _ !== player);

		if (!opponent) throw new Error("Could not find opponent");

		const opponentGame = games.get(opponent);
		const yourGame = games.get(player);

		if (!opponentGame) throw new Error("Could not find opponent game");
		if (!yourGame) throw new Error("Could not find your game");

		const opponentBoard = opponentGame.getBoard();
		const yourBoard = yourGame.getBoard();

		player.send({ type: ServerMessageType.Start, opponentBoard, yourBoard });

		yourGame.addListener("change", () => {
			if (!opponent.isOpen) return;

			player.send({
				board: yourBoard,
				type: ServerMessageType.YourBoard,
			});
			opponent.send({
				board: yourBoard,
				opponentId: player.uuid,
				type: ServerMessageType.OpponentBoard,
			});
		});
	}
}

function stopAllGames() {
	for (const player of connection.clients) {
		const game = games.get(player);

		if (game) {
			game.stop();
			games.delete(player);
		}
	}
}

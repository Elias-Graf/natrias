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
		const playerGame = games.get(player);

		if (!opponentGame) throw new Error("Could not find opponent game");
		if (!playerGame) throw new Error("Could not find your game");

		const opponentBoard = opponentGame.board;
		const opponentNextUp = opponentGame.nextUp;
		const playerBoard = playerGame.board;
		const playerNextUp = playerGame.nextUp;

		// Notify the player about the game start
		player.send({
			opponentBoard,
			type: ServerMessageType.Start,
			yourBoard: playerBoard,
			yourNextUp: playerNextUp,
			opponentNextUp: opponentNextUp,
		});

		playerGame.addListener("change", () => {
			const { board, nextUp } = playerGame;

			if (!player.isOpen) return;
			player.send({ board, nextUp, type: ServerMessageType.YourBoard });

			if (!opponent.isOpen) return;
			opponent.send({
				board,
				opponentId: player.uuid,
				type: ServerMessageType.OpponentBoard,
				nextUp,
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

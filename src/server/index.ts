import ServerMessageType from "shared/ServerMessageType";
import GameLogic from "./game/GameLogic";
import Connection from "./connection/Connection";
import WebSocketConnection from "./connection/WebSocketConnection";
import Client from "./connection/Client";
import ClientMessageType from "shared/ClientMessageType";
import NextUpProvider from "./game/NextUpProvider";

const NEXT_UP_LIST_SIZE = 10;

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

	if (message.type === ClientMessageType.Move)
		game.moveActiveTetromino(message.dir);
	else if (message.type === ClientMessageType.Restart) {
		stopAllGames();
		createAndStartGames();
	} else if (message.type === ClientMessageType.Rotate)
		game.rotateActiveTetromino();
	else if (message.type === ClientMessageType.SwitchWithHoldingPiece)
		game.switchWithHoldingPiece();
});

function createAndStartGames() {
	const { clients } = connection;
	const nextUpProvider = new NextUpProvider(NEXT_UP_LIST_SIZE);

	for (const player of clients) {
		const game = new GameLogic(nextUpProvider);

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
		const opponentNextUp = getNextUpListForGame(opponentGame, nextUpProvider);
		const playerBoard = playerGame.board;
		const playerNextUp = getNextUpListForGame(playerGame, nextUpProvider);

		// Notify the player about the game start
		player.send({
			opponentBoard,
			type: ServerMessageType.Start,
			yourBoard: playerBoard,
			yourNextUp: playerNextUp,
			opponentNextUp: opponentNextUp,
		});

		playerGame.addListener("change", () => {
			const { board, holdingPiece } = playerGame;
			const nextUp = getNextUpListForGame(playerGame, nextUpProvider);

			if (!player.isOpen) return;
			player.send({
				board,
				holdingPiece,
				nextUp,
				type: ServerMessageType.YourBoard,
			});

			if (!opponent.isOpen) return;
			opponent.send({
				board,
				holdingPiece,
				nextUp,
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

function getNextUpListForGame(
	{ nextUpIndex }: GameLogic,
	{ nextUpList }: NextUpProvider
) {
	return nextUpList.slice(nextUpIndex, nextUpIndex + NEXT_UP_LIST_SIZE);
}

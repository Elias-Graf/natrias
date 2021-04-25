import ClientMessage from "shared/ClientMessage";
import ClientMessageType from "shared/ClientMessageType";
import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import Dir from "shared/Dir";
import Board from "shared/Board";

const socket = new WebSocket("ws://192.168.1.142:4001");
const restartBtn = document.getElementById("restartBtn");
const yourBoard = document.getElementById("yourBoard");
const opponentBoard = document.getElementById("opponentBoard");

if (!restartBtn) throw new Error("Could not find restart btn");
if (!yourBoard) throw new Error("Could not find your board DOM element");
if (!opponentBoard)
	throw new Error("Could not find opponent board DOM element");

restartBtn.addEventListener("click", () => {
	socket.send(
		JSON.stringify({ type: ClientMessageType.Restart } as ClientMessage)
	);
});

socket.addEventListener("message", (sockMsg) => {
	const msg: ServerMessage = JSON.parse(sockMsg.data);

	switch (msg.type) {
		case ServerMessageType.OpponentBoard:
			opponentBoard.innerText = formatBoard(msg.board);
			break;
		case ServerMessageType.Start:
			console.log("Game started");
			break;
		case ServerMessageType.Stop:
			console.log("Game stopped");
			break;
		case ServerMessageType.YourBoard:
			yourBoard.innerText = formatBoard(msg.board);
			break;
	}
});

document.addEventListener("keydown", (e) => {
	e.preventDefault();

	const dir = keyToDirection(e.key);

	if (dir) {
		let m: ClientMessage;

		if (dir === Dir.Up) m = { type: ClientMessageType.Rotate };
		else m = { type: ClientMessageType.Move, dir };

		socket.send(JSON.stringify(m));
	}
});

function formatBoard(b: Board): string {
	return b
		.map((row) => row.map((block) => (block ? "□" : "■")).join(""))
		.join("\n");
}

/**
 * Parses a key input into a direction.
 * @param key to pase.
 * @returns the direction if found, otherwise `undefined`.
 */
function keyToDirection(key: string) {
	return new Map<string, Dir>([
		["ArrowDown", Dir.Down],
		["ArrowLeft", Dir.Left],
		["ArrowRight", Dir.Right],
		["ArrowUp", Dir.Up],
	]).get(key);
}

import ClientMessage from "shared/ClientMessage";
import ClientMessageType from "shared/ClientMessageType";
import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import Dir from "shared/Dir";

const socket = new WebSocket("ws://localhost:4001");

socket.addEventListener("message", (sockMsg) => {
	const msg: ServerMessage = JSON.parse(sockMsg.data);

	switch (msg.type) {
		case ServerMessageType.Board:
			document.body.innerHTML = `<pre style="line-height: 0.6em;letter-spacing: 0.1em;">${msg.board
				.map((row) => row.map((block) => (block ? "□" : "■")).join(""))
				.join("\n")}</pre>`;
			break;
		case ServerMessageType.Start:
			console.log("Game started");
			break;
		case ServerMessageType.Stop:
			console.log("Game stopped");
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

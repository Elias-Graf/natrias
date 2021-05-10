import ClientMessageType from "shared/ClientMessageType";
import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import Dir from "shared/Dir";
import WebSocketConnection from "./connection/WebSocketConnection";
import CanvasRendery2D from "rendery/2d/CanvasRendery2D";
import BoardsRenderer from "./boardRenderer/BoardsRenderer";

const BLOCK_SIZE = 25;
const keyToDirectory: ReadonlyMap<string, Dir> = new Map([
	["ArrowDown", Dir.Down],
	["ArrowLeft", Dir.Left],
	["ArrowRight", Dir.Right],
	["ArrowUp", Dir.Up],
]);

const restartBtn = document.getElementById(
	"restartBtn"
) as HTMLButtonElement | null;

if (!restartBtn) throw new Error("Could not find restart btn");

const server = new WebSocketConnection("ws://localhost:4001");
const renderer = new CanvasRendery2D(
	document.body,
	(BLOCK_SIZE + 1) * 10 * 2,
	BLOCK_SIZE * 20,
	"#A71E81"
);
let boardsRenderer: BoardsRenderer | undefined;

const handleKeyPress = (e: KeyboardEvent) => {
	// We don't want to browser to scroll or anything else.
	e.preventDefault();

	const dir = keyToDirectory.get(e.key);

	if (dir) {
		if (dir === Dir.Up) server.send({ type: ClientMessageType.Rotate });
		else server.send({ type: ClientMessageType.Move, dir });
	}
};
const handleMessage = (m: ServerMessage) => {
	switch (m.type) {
		case ServerMessageType.OpponentBoard:
			if (!boardsRenderer) {
				console.error("Received opponent board but no board renderer present");
				return;
			}

			boardsRenderer.updateOpponentBoard(m.board);
			break;
		case ServerMessageType.Start:
			console.log("game start");
			if (boardsRenderer) {
				console.warn("Board renderer present before game started");
			} else {
				boardsRenderer = new BoardsRenderer(
					BLOCK_SIZE,
					m.yourBoard,
					m.opponentBoard
				);

				renderer.registerDrawable(boardsRenderer);
			}
			break;
		case ServerMessageType.Stop:
			console.log("Game stopped");
			break;
		case ServerMessageType.YourBoard:
			if (!boardsRenderer) {
				console.error("Received your board but no board renderer present");
				return;
			}

			boardsRenderer.updateOwnBoard(m.board);
			break;
	}
};

document.addEventListener("keydown", handleKeyPress);
restartBtn.addEventListener("click", () => {
	server.send({ type: ClientMessageType.Restart });
});
server.addListener("message", handleMessage);

renderer.start();

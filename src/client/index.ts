import ClientMessageType from "shared/ClientMessageType";
import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import Dir from "shared/Dir";
import WebSocketConnection from "./connection/WebSocketConnection";
import CanvasRendery2D from "rendery/2d/CanvasRendery2D";
import BoardsRenderer from "./boardRenderer/BoardsRenderer";

const keyToDirectory: ReadonlyMap<string, Dir> = new Map([
	["ArrowDown", Dir.Down],
	["ArrowLeft", Dir.Left],
	["ArrowRight", Dir.Right],
	["ArrowUp", Dir.Up],
]);
const knownKeys = new Set([
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"n",
]);

const server = new WebSocketConnection(`ws://${window.location.hostname}:4001`);
const renderer = new CanvasRendery2D(document.body, 0, 0, "#000000").dynamic;

let boardsRenderer: BoardsRenderer | undefined;

const handleKeyPress = (e: KeyboardEvent) => {
	const { key } = e;

	if (!knownKeys.has(key)) return;
	// We don't want to browser to scroll or anything else.
	e.preventDefault();

	const dir = keyToDirectory.get(key);

	if (dir) {
		if (dir === Dir.Up) server.send({ type: ClientMessageType.Rotate });
		else server.send({ type: ClientMessageType.Move, dir });
	} else if (key === "n")
		server.send({ type: ClientMessageType.SwitchWithHoldingPiece });
};
const handleMessage = (msg: ServerMessage) => {
	switch (msg.type) {
		case ServerMessageType.OpponentBoard: {
			const { board, nextUp, holdingPiece } = msg;

			if (!boardsRenderer) {
				console.error("Received opponent board but no board renderer present");
				return;
			}

			boardsRenderer.opponentHoldingPiece = holdingPiece;
			boardsRenderer.opponentNextUp = nextUp;
			boardsRenderer.updateOpponentBoard(board);
			break;
		}
		case ServerMessageType.Start:
			const { yourBoard, opponentBoard, yourNextUp, opponentNextUp } = msg;

			console.log("game start");

			if (boardsRenderer) {
				console.warn("Board renderer present before game started");
			} else {
				boardsRenderer = new BoardsRenderer(
					yourBoard,
					yourNextUp,
					opponentBoard,
					opponentNextUp
				);

				renderer.registerDrawable(boardsRenderer);
			}
			break;
		case ServerMessageType.Stop:
			console.log("Game stopped");
			break;
		case ServerMessageType.YourBoard: {
			const { board, nextUp, holdingPiece } = msg;

			if (!boardsRenderer) {
				console.error("Received your board but no board renderer present");
				return;
			}

			boardsRenderer.updateOwnBoard(board);
			boardsRenderer.ownHoldingPiece = holdingPiece;
			boardsRenderer.ownNextUp = nextUp;
			break;
		}
	}
};

document.addEventListener("keydown", handleKeyPress);
server.addListener("message", handleMessage);

renderer.start();

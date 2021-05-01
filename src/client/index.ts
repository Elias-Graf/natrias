import ClientMessageType from "shared/ClientMessageType";
import ServerMessage from "shared/ServerMessage";
import ServerMessageType from "shared/ServerMessageType";
import Dir from "shared/Dir";
import Board from "shared/Board";
import WebSocketConnection from "./connection/WebSocketConnection";
import Drawable2D from "rendery/2d/Drawable2D";
import Connection from "./connection/connection";
import RenderyContext2D from "rendery/2d/RenderyContext2D";
import CanvasRendery2D from "rendery/2d/CanvasRendery2D";
import Vector2 from "newton/2d/Vector2";

const BLOCK_SIZE = 25;

class BoardRenderer implements Drawable2D {
	private server: Connection = new WebSocketConnection("ws://localhost:4001");
	private restartBtn: HTMLButtonElement;
	private yourBoardElement: HTMLDivElement;
	private yourBoard: Board | undefined;
	private opponentBoardElement: HTMLDivElement;

	private readonly keyToDirectory: ReadonlyMap<string, Dir> = new Map([
		["ArrowDown", Dir.Down],
		["ArrowLeft", Dir.Left],
		["ArrowRight", Dir.Right],
		["ArrowUp", Dir.Up],
	]);

	public constructor() {
		const restartBtn = document.getElementById("restartBtn");
		const yourBoard = document.getElementById("yourBoard");
		const opponentBoard = document.getElementById("opponentBoard");

		if (!restartBtn) throw new Error("Could not find restart btn");
		if (!yourBoard) throw new Error("Could not find your board DOM element");
		if (!opponentBoard)
			throw new Error("Could not find opponent board DOM element");

		this.restartBtn = restartBtn as HTMLButtonElement;
		this.yourBoardElement = yourBoard as HTMLDivElement;
		this.opponentBoardElement = opponentBoard as HTMLDivElement;

		this.restartBtn.addEventListener("click", () => {
			this.server.send({ type: ClientMessageType.Restart });
		});

		this.server.addListener("message", this.handleMessage);

		document.addEventListener("keydown", this.handleKeyPress);
	}

	public draw(context: RenderyContext2D): void {
		if (!this.yourBoard) return;

		// TODO: this makes the board with hard-coded.
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				if (this.yourBoard[y][x]) {
					context.rect(
						new Vector2(x * BLOCK_SIZE, y * BLOCK_SIZE),
						new Vector2(BLOCK_SIZE, BLOCK_SIZE),
						"yellow"
					);
				}
			}
		}
	}

	private formatBoard(b: Board) {
		return b
			.map((row) => row.map((block) => (block ? "□" : "■")).join(""))
			.join("\n");
	}
	private handleMessage = (m: ServerMessage) => {
		switch (m.type) {
			case ServerMessageType.OpponentBoard:
				this.opponentBoardElement.innerText = this.formatBoard(m.board);
				break;
			case ServerMessageType.Start:
				console.log("Game started");
				break;
			case ServerMessageType.Stop:
				console.log("Game stopped");
				break;
			case ServerMessageType.YourBoard:
				this.yourBoard = m.board;
				this.yourBoardElement.innerText = this.formatBoard(this.yourBoard);
				break;
		}
	};
	private handleKeyPress = (e: KeyboardEvent) => {
		// We don't want to browser to scroll or anything else.
		e.preventDefault();

		const dir = this.keyToDirectory.get(e.key);

		if (dir) {
			if (dir === Dir.Up) this.server.send({ type: ClientMessageType.Rotate });
			else this.server.send({ type: ClientMessageType.Move, dir });
		}
	};
}

const renderer = new CanvasRendery2D(
	document.body,
	BLOCK_SIZE * 10,
	BLOCK_SIZE * 20,
	"#A71E81"
);
renderer.start();
renderer.registerDrawable(new BoardRenderer());

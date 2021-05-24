import Drawable2D from "rendery/2d/Drawable2D";
import Board from "shared/Board";
import BoardRenderer from "./BoardRenderer";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TetrominoType from "shared/TetrominoType";

export default class BoardsRenderer implements Drawable2D {
	private opponentRenderer;
	private ownRenderer;

	public constructor(
		ownBoard: Board,
		ownNextUp: TetrominoType[],
		opponentBoard: Board,
		opponentNextUp: TetrominoType[]
	) {
		this.opponentRenderer = new BoardRenderer(opponentBoard, ownNextUp);
		this.ownRenderer = new BoardRenderer(ownBoard, opponentNextUp);
	}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		const c = ctx.clone;
		const ownCtx = c.clone;
		ownCtx.width = c.width / 2;

		const opponentCtx = ownCtx.clone.translate(ownCtx.width, 0);

		this.ownRenderer.draw(ownCtx);
		this.opponentRenderer.draw(opponentCtx);
	}

	public set ownHoldingPiece(p: TetrominoType | undefined) {
		this.ownRenderer.holdingPiece = p;
	}
	public set ownNextUp(n: TetrominoType[]) {
		this.ownRenderer.nextUp = n;
	}
	public set opponentHoldingPiece(p: TetrominoType | undefined) {
		this.opponentRenderer.holdingPiece = p;
	}
	public set opponentNextUp(n: TetrominoType[]) {
		this.opponentRenderer.nextUp = n;
	}
	public set opponentBoard(b: Board) {
		this.opponentRenderer.board = b;
	}
	public set ownBoard(b: Board) {
		this.ownRenderer.board = b;
	}
}

import Drawable2D from "rendery/2d/Drawable2D";
import Board from "shared/Board";
import RenderyContext2D from "rendery/2d/RenderyContext2D";
import BoardRenderer from "./BoardRenderer";

export default class BoardsRenderer implements Drawable2D {
	private enemyBoard;
	private ownBoard;

	public constructor(
		private blockSize: number,
		ownBoard: Board,
		enemyBoard: Board
	) {
		this.enemyBoard = new BoardRenderer(blockSize, enemyBoard);
		this.ownBoard = new BoardRenderer(blockSize, ownBoard);
	}

	// TODO: remove hardcoded size
	public draw(ctx: RenderyContext2D): void {
		this.ownBoard.draw(ctx);

		for (let y = 0; y < 20; y++) {
			ctx.rect(
				10 * this.blockSize,
				y * this.blockSize,
				this.blockSize,
				this.blockSize,
				"red"
			);
		}

		this.enemyBoard.draw(ctx.clone.translate(this.blockSize * 11, 0));
	}

	public updateOpponentBoard(b: Board): void {
		this.enemyBoard.setBoard(b);
	}
	public updateOwnBoard(b: Board): void {
		this.ownBoard.setBoard(b);
	}
}

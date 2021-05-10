import Drawable2D from "rendery/2d/Drawable2D";
import RenderyContext2D from "rendery/2d/RenderyContext2D";
import Board from "shared/Board";

export default class BoardRenderer implements Drawable2D {
	public constructor(private blockSize: number, private board: Board) {}

	public draw(ctx: RenderyContext2D): void {
		const { blockSize } = this;

		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				if (this.board[y][x]) {
					ctx.rect(
						x * blockSize,
						y * blockSize,
						blockSize,
						blockSize,
						"yellow"
					);
				}
			}
		}
	}

	public setBoard(board: Board) {
		this.board = board;
	}
}

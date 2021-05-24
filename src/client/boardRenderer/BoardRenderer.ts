import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TetrominoType from "server/game/TetrominoType";
import Board from "shared/Board";
import HoldingPieceRenderer from "./HoldingPieceRenderer";
import NextUpRenderer from "./NextUpRenderer";

export default class BoardRenderer implements Drawable2D {
	private nextUpRenderer: NextUpRenderer;
	private holdingPieceRenderer = new HoldingPieceRenderer();

	public constructor(public board: Board, nextUp: TetrominoType[]) {
		this.nextUpRenderer = new NextUpRenderer(nextUp);
	}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		flex(ctx, [
			[this.holdingPieceRenderer, 1],
			[{ draw: (c) => this.drawBoard(c) }, 3],
			[this.nextUpRenderer, 1],
		]);
	}

	private drawBoard(ctx: ReadonlyRenderyContext2D) {
		const rCtx = ctx.clone;
		const blockSize = rCtx.width / 10;
		rCtx.inRatio(1 / 2);
		rCtx.fill("#000000AA");

		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				if (this.board[y][x]) {
					rCtx.rect(
						Math.floor(x * blockSize),
						Math.floor(y * blockSize),
						blockSize,
						blockSize,
						"yellow"
					);
				}
			}
		}
	}

	public set nextUp(nextUp: TetrominoType[]) {
		this.nextUpRenderer.nextUp = nextUp;
	}
	public set holdingPiece(piece: TetrominoType | undefined) {
		this.holdingPieceRenderer.piece = piece;
	}
}

/**
 * @deprecated Move to the rendery context.
 */
function flex(
	ctx: ReadonlyRenderyContext2D,
	drawables: [drawable: Drawable2D, flex: number][]
): void {
	let sections = 0;

	for (const [, f] of drawables) sections += f;

	const oneWidth = ctx.width / sections;
	const dCtx = ctx.clone;

	for (const [d, f] of drawables) {
		dCtx.width = f * oneWidth;

		d.draw(dCtx);

		dCtx.translate(dCtx.width, 0);
	}
}

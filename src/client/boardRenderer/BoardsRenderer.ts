import Drawable2D from "rendery/2d/Drawable2D";
import Board from "shared/Board";
import BoardRenderer from "./BoardRenderer";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TetrominoType from "server/game/TetrominoType";
import RenderyContext2D from "rendery/2d/RenderyContext2D";

export default class BoardsRenderer implements Drawable2D {
	private opponentRenderer;
	private ownRenderer;

	private readonly ratio = ((10 + 3) * 2) / 20;

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
		const c = inset(center(ctx, ratio(ctx, this.ratio)), 50);
		c.fill("#FFFFFF22");

		const ownCtx = c.clone;
		ownCtx.width = c.width / 2;

		const opponentCtx = ownCtx.clone.translate(ownCtx.width, 0);

		this.ownRenderer.draw(ownCtx);
		this.opponentRenderer.draw(opponentCtx);
	}

	public updateOpponentBoard(b: Board): void {
		this.opponentRenderer.board = b;
	}
	public updateOwnBoard(b: Board): void {
		this.ownRenderer.board = b;
	}

	public set ownNextUp(nextUp: TetrominoType[]) {
		this.ownRenderer.nextUp = nextUp;
	}
}

/**
 * @deprecated
 */
function center(
	container: ReadonlyRenderyContext2D,
	child: ReadonlyRenderyContext2D
): RenderyContext2D {
	const ret = child.clone;
	const hOff = (container.width - child.width) / 2;
	const vOff = (container.height - child.height) / 2;

	ret.translate(hOff, vOff);

	return ret;
}
/**
 * @deprecated
 */
function inset(
	ctx: ReadonlyRenderyContext2D,
	amount: number
): RenderyContext2D {
	const ret = ctx.clone;

	ret.translate(amount, amount);
	ret.height -= amount * 2;
	ret.width -= amount * 2;

	return ret;
}
/**
 * @deprecated
 */
export function ratio(
	ctx: ReadonlyRenderyContext2D,
	ratio: number
): RenderyContext2D {
	const ret = ctx.clone;

	if (ret.width > ret.height * ratio)
		ret.width = Math.floor(ratio * ret.height);
	else ret.height = Math.floor(ret.width / ratio);

	return ret;
}

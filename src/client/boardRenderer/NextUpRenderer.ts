import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import templates from "server/game/templates";
import TetrominoType from "server/game/TetrominoType";

export default class NextUpRenderer implements Drawable2D {
	public constructor(public nextUp: TetrominoType[]) {}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		ctx.fill("#00000044");

		// We allow a maximal width of 3
		const blockSize = ctx.width / 3;
		const blockCtx = ctx.clone;

		for (const next of this.nextUp) {
			const { height, xMin, yMin } = this.getDimensionOfTetrominoType(next);

			for (const { x: bX, y: bY } of templates[next]) {
				const yCompensateForNegative = bY - yMin;
				const xCompensateForNegative = bX - xMin;
				const x = xCompensateForNegative * blockSize;
				const y = yCompensateForNegative * blockSize;

				if ((blockCtx.getTranslate()?.y ?? 0) < blockCtx.height) {
					blockCtx.rect(x, y, blockSize, blockSize, "orange");
				}
			}

			blockCtx.translate(0, (height + 1) * blockSize);
		}
	}

	private getDimensionOfTetrominoType(
		type: TetrominoType
	): {
		height: number;
		xMin: number;
		yMin: number;
	} {
		let xMax = 0;
		let xMin = 0;
		let yMax = 0;
		let yMin = 0;

		for (const { x, y } of templates[type]) {
			if (x > xMax) xMax = x;
			if (x < xMin) xMin = x;
			if (y > yMax) yMax = y;
			if (y < yMin) yMin = y;
		}

		return {
			// 0 is also a block, so plus 1
			height: yMax - yMin + 1,
			xMin,
			yMin,
		};
	}
}

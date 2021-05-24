import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TEMPLATES from "server/game/templates";
import TetrominoType from "server/game/TetrominoType";
import getDimensionsOfTemplate from "shared/getDimensionsOfTemplate";

// TODO: We should not import `server/*` files. Move those files to `shared` if
// necessary.
export default class NextUpRenderer implements Drawable2D {
	public constructor(public nextUp: TetrominoType[]) {}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		ctx.fill("#00000044");

		// We allow a maximal width of 3
		const blockSize = ctx.width / 3;
		const blockCtx = ctx.clone;

		// TODO: replace with tetromino template renderer.
		for (const next of this.nextUp) {
			const nextTemplate = TEMPLATES[next];
			const { height, xMin, yMin } = getDimensionsOfTemplate(nextTemplate);

			for (const { x: bX, y: bY } of nextTemplate) {
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
}

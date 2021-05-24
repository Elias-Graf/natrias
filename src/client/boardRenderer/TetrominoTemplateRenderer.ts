import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TEMPLATES from "shared/templates";
import TetrominoType from "shared/TetrominoType";
import getDimensionsOfTemplate from "shared/getDimensionsOfTemplate";

export default class TetrominoTemplateRenderer implements Drawable2D {
	public constructor(private tetrominoType: TetrominoType) {}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		// Currently only a max width of 3 is allowed
		const blockSize = ctx.width / 3;
		const template = TEMPLATES[this.tetrominoType];
		const { yMin, xMin } = getDimensionsOfTemplate(template);

		for (const { x: bX, y: bY } of template) {
			const yCompensateForNegative = bY - yMin;
			const xCompensateForNegative = bX - xMin;
			const x = xCompensateForNegative * blockSize;
			const y = yCompensateForNegative * blockSize;

			ctx.rect(x, y, blockSize, blockSize, "orange");
		}
	}
}

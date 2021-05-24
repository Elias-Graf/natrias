import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TEMPLATES from "shared/templates";
import TetrominoType from "shared/TetrominoType";
import getDimensionsOfTemplate from "shared/getDimensionsOfTemplate";
import TetrominoTemplateRenderer from "./TetrominoTemplateRenderer";

export default class NextUpRenderer implements Drawable2D {
	public constructor(public nextUp: TetrominoType[]) {}

	public draw(ctx: ReadonlyRenderyContext2D): void {
		ctx.fill("#00000044");

		// We allow a maximal width of 3
		const blockSize = ctx.width / 3;
		const blockCtx = ctx.clone;

		for (const n of this.nextUp) {
			new TetrominoTemplateRenderer(n).draw(blockCtx);

			const template = TEMPLATES[n];
			const { height } = getDimensionsOfTemplate(template);

			blockCtx.translate(0, (height + 1) * blockSize);
		}
	}
}

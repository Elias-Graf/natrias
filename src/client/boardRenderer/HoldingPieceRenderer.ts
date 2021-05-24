import Drawable2D from "rendery/2d/Drawable2D";
import ReadonlyRenderyContext2D from "rendery/2d/ReadonlyRenderyContext2D";
import TetrominoType from "server/game/TetrominoType";
import TetrominoTemplateRenderer from "./TetrominoTemplateRenderer";

export default class HoldingPieceRenderer implements Drawable2D {
	public piece: TetrominoType | undefined;

	public draw(ctx: ReadonlyRenderyContext2D): void {
		const { piece } = this;

		if (piece !== undefined) new TetrominoTemplateRenderer(piece).draw(ctx);
	}
}

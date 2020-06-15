import { Drawable } from '../render';
import { Point2D } from '../globals';

export class DrawableBlock extends Point2D implements Drawable {
	public static SIZE = 50;
	private static BORDER_OFFSET = 12;

	public render(ctx: CanvasRenderingContext2D): void {
		DrawableBlock.render(ctx, this);
	}

	public static render(ctx: CanvasRenderingContext2D, origin: Point2D): void {
		const x = origin.getX();
		const y = origin.getY();
		const SIZE = DrawableBlock.SIZE;
		const BORDER_WIDTH = DrawableBlock.BORDER_OFFSET;

		ctx.translate(x, y);

		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, SIZE, SIZE);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(SIZE, 0);
		ctx.lineTo(SIZE, SIZE);
		ctx.lineTo(SIZE - BORDER_WIDTH, SIZE - BORDER_WIDTH);
		ctx.lineTo(SIZE - BORDER_WIDTH, BORDER_WIDTH);
		ctx.lineTo(BORDER_WIDTH, BORDER_WIDTH);
		ctx.fillStyle = 'tomato';
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, SIZE);
		ctx.lineTo(SIZE, SIZE);
		ctx.lineTo(SIZE - BORDER_WIDTH, SIZE - BORDER_WIDTH);
		ctx.lineTo(BORDER_WIDTH, SIZE - BORDER_WIDTH);
		ctx.lineTo(BORDER_WIDTH, BORDER_WIDTH);
		ctx.fillStyle = 'darkred';
		ctx.fill();

		ctx.resetTransform();
	}
}

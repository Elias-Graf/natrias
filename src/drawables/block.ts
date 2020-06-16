import { Drawable, RendererInterface } from '../render';
import { Point2D } from '../globals';
import { Block } from '../physics/block';

export class DrawableBlock implements Drawable, Block {
	public setRenderer(renderer: RendererInterface): void {
		this.renderer = renderer;
	}
	private position: Point2D;
	private renderer: RendererInterface | undefined;

	public static SIZE = 50;
	private static BORDER_OFFSET = 12;

	public constructor(position: Point2D) {
		this.position = position;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		const x = this.position.getX() * 50;
		const y = this.position.getY() * 50;
		DrawableBlock.render(ctx, new Point2D(x, y));
	}

	public getPosition(): Point2D {
		return this.position;
	}
	public onDelete(): void {
		if (this.renderer === undefined) {
			console.error('cannot delete block as renderer is not present');
		} else {
			this.renderer.unregisterDrawable(this);
		}
	}
	public setPosition(position: Point2D): void {
		this.position = position;
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

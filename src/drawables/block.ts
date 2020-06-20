import { DefaultDrawable } from '../render';
import { Point2D } from '../globals';
import { Block } from '../physics/block';

export class DrawableBlock extends DefaultDrawable implements Block {
	private position: Point2D;
	private template: Point2D;

	public static SIZE = 50;
	public static BORDER_OFFSET = 12;

	public constructor(position: Point2D, template: Point2D) {
		super();

		this.position = position;
		this.template = template;
	}

	public getPosition(): Point2D {
		return this.position;
	}
	public getTemplate(): Point2D {
		return this.template;
	}
	public onDelete(): void {
		const renderer = this.dangerousGetRenderer();
		if (renderer === null) {
			console.error('cannot delete block as renderer is not present');
		} else renderer.unregisterDrawable(this);
	}
	public render(ctx: CanvasRenderingContext2D): void {
		const position = this.position.clone().scale(DrawableBlock.SIZE);
		const x = position.getX();
		const y = position.getY();
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
	public setPosition(position: Point2D): void {
		this.position = position;
	}
}

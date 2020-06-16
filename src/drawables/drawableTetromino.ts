import { Drawable, RendererInterface } from '../render';
import { Tetromino } from '../physics';
import { Point2D } from '../globals';
import { DrawableBlock } from './drawableBlock';
import { TemplateType } from '../tetrominoes/type';
import { getTemplate } from '../tetrominoes';

export class DrawableTetromino implements Drawable, Tetromino {
	private origin: Point2D;
	private renderer: RendererInterface | undefined;
	private rotation = 0;
	private template: Point2D[];
	private type: TemplateType;

	public constructor(origin: Point2D, type: TemplateType) {
		this.origin = origin;
		this.template = getTemplate(type);
		this.type = type;
	}
	public rotate(): void {
		if (this.type !== TemplateType.O) {
			let nextRotation = this.rotation;
			if (++nextRotation === 4) {
				nextRotation = 0;
			}
			this.rotation = nextRotation;
		}
	}

	public getType(): TemplateType {
		return this.type;
	}

	public calculateAbsoluteBlocks(): Point2D[] {
		const { origin, template } = this;

		return template.map((block) => {
			const blockX = block.getX();
			const blockY = block.getY();
			const newBlock = new Point2D(blockX, blockY);

			// Calculate rotation
			switch (this.getRotation()) {
				case 0:
					break;
				case 1:
					newBlock.setX(blockY * -1);
					newBlock.setY(blockX);
					break;
				case 2:
					newBlock.setX(blockX * -1);
					newBlock.setY(blockY * -1);
					break;
				case 3:
					newBlock.setX(blockY);
					newBlock.setY(blockX * -1);
					break;
				default:
					console.error(`Rotation not in limit: ${this.getRotation()}`);
					break;
			}
			// Make block absolute
			newBlock.setX(newBlock.getX() + origin.getX());
			newBlock.setY(newBlock.getY() + origin.getY());
			return newBlock;
		});
	}
	public clone(): Tetromino {
		const clone = new DrawableTetromino(this.origin.clone(), this.type);
		// We need to clone additional properties
		clone.setRotation(this.rotation);
		return clone;
	}
	public getOrigin(): Point2D {
		return this.origin;
	}
	public getRotation(): number {
		return this.rotation;
	}
	public render(context: CanvasRenderingContext2D): void {
		this.calculateAbsoluteBlocks().forEach((block) => {
			DrawableBlock.render(
				context,
				new Point2D(
					block.getX() * DrawableBlock.SIZE,
					block.getY() * DrawableBlock.SIZE
				)
			);
		});
	}
	public setOrigin(origin: Point2D): void {
		this.origin = origin;
	}
	public setRenderer(renderer: RendererInterface): void {
		this.renderer = renderer;
	}
	public setRotation(rotation: number): void {
		this.rotation = rotation;
	}
}

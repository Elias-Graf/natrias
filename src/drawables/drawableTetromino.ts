import { Drawable } from '../render';
import { Tetromino } from '../physics';
import { Point2D } from '../globals';
import { DrawableBlock } from './drawableBlock';
import { TemplateType } from '../tetrominoes/type';

export class DrawableTetromino implements Drawable, Tetromino {
	private blocks: Point2D[];
	private origin: Point2D;
	private type: TemplateType;
	private rotation = 0;

	public constructor(origin: Point2D, template: Point2D[], type: TemplateType) {
		this.origin = origin;
		this.blocks = template;
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
		const { blocks, origin } = this;

		return blocks.map((block) => {
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
		const clone = new DrawableTetromino(
			this.origin.clone(),
			this.blocks.map(Point2D.clone),
			this.type
		);
		clone.setRotation(this.rotation);
		return clone;
	}
	public getBlocks(): Point2D[] {
		return this.blocks;
	}
	public getOrigin(): Point2D {
		return this.origin;
	}
	public getRotation(): number {
		return this.rotation;
	}
	public render(ctx: CanvasRenderingContext2D): void {
		this.calculateAbsoluteBlocks().forEach((_) => {
			DrawableBlock.render(
				ctx,
				new Point2D(
					_.getX() * DrawableBlock.SIZE,
					_.getY() * DrawableBlock.SIZE
				)
			);
		});
	}
	public setBlocks(newBlocks: Point2D[]): void {
		this.blocks = newBlocks;
	}
	public setOrigin(newOrigin: Point2D): void {
		this.origin = newOrigin;
	}
	public setRotation(newRotation: number): void {
		this.rotation = newRotation;
	}
}

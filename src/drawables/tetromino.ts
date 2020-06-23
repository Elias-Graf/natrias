import { Tetromino } from '../physics';
import { Point2D, Dir } from '../globals';
import { DrawableBlock } from './block';
import { TemplateType } from '../tetrominoes/type';
import { getTemplate } from '../tetrominoes';
import { DefaultDrawable } from '../render/defaultDrawable';

// TODO: blocks as children (not template)

export class DrawableTetromino extends DefaultDrawable implements Tetromino {
	private blocks: DrawableBlock[] = [];
	private origin: Point2D;
	private template: Point2D[];
	private rotation = 0;
	private type: TemplateType;
	private colors: { dark: string; light: string; normal: string } = {
		dark: 'darkred',
		light: 'tomato',
		normal: 'red',
	};

	public constructor(origin: Point2D, type: TemplateType) {
		super();

		this.template = getTemplate(type);
		this.origin = origin;
		this.type = type;

		// This not just sets the type, but also generates the blocks
		this.setType(type);
	}

	public setColors(colors: {
		dark: string;
		light: string;
		normal: string;
	}): void {
		this.colors = colors;
		this.blocks.forEach((block) => block.setColors(colors));
	}

	public assign(tetromino: Tetromino): void {
		console.warn('this function should not be used');
		this.origin.assign(tetromino.getOrigin());
		this.rotation = tetromino.getRotation();
		this.type = tetromino.getType();
		this.blocks = getTemplate(this.type).map((template) => {
			const drawableBlock = new DrawableBlock(
				template.clone(),
				template.clone()
			);
			drawableBlock.setColors(this.colors);
			return drawableBlock;
		});
	}
	public clone(): DrawableTetromino {
		console.warn('this function should not be used');
		const tetromino = new DrawableTetromino(this.origin.clone(), this.type);
		tetromino.setRotation(this.rotation);
		return tetromino;
	}
	public getBlocks(): DrawableBlock[] {
		return this.blocks;
	}
	public getOrigin(): Point2D {
		return this.origin;
	}
	public move(direction: Dir): void {
		if (direction === Dir.DOWN) this.origin.add(new Point2D(0, 1));
		else if (direction === Dir.LEFT) this.origin.add(new Point2D(-1, 0));
		else if (direction === Dir.RIGHT) this.origin.add(new Point2D(1, 0));
		else if (direction === Dir.UP) this.origin.add(new Point2D(0, -1));
		else console.warn(`Unknown direction ${direction}`);

		this.reassessBlocks();
	}
	public getType(): TemplateType {
		return this.type;
	}
	public getRotation(): number {
		return this.rotation;
	}
	public render(context: CanvasRenderingContext2D): void {
		this.blocks.forEach((block) => block.render(context));
	}
	public rotate(amount = 1): void {
		// We don't want to rotate the O shape
		if (this.type !== TemplateType.O) {
			this.rotation += amount;
			switch (this.type) {
				// Some shapes only need two rotations
				case TemplateType.I:
				case TemplateType.S:
				case TemplateType.Z:
					if (this.rotation > 1) this.rotation = 0;
					if (this.rotation < 0) this.rotation = 1;
					break;
				default:
					if (this.rotation > 3) this.rotation = 0;
					if (this.rotation < 0) this.rotation = 3;
			}
			this.reassessBlocks();
		}
	}
	public setOrigin(origin: Point2D): void {
		this.origin = origin;
		this.reassessBlocks();
	}
	public setRotation(rotation: number): void {
		this.rotation = rotation;
		this.reassessBlocks();
	}
	public setType(type: TemplateType): void {
		this.type = type;
		this.blocks = getTemplate(type).map((position) => {
			const block = new DrawableBlock(position.clone(), position.clone());
			block.setColors(this.colors);
			return block;
		});
		this.reassessBlocks();
	}
	/**
	 * Reassesses the position of the child blocks according to the origin and the rotation.
	 */
	private reassessBlocks(): void {
		this.blocks.forEach((block) => {
			const position = block.getPosition();

			// Set the the position to the template. This will make the position relative
			// to the tetromino origin.
			position.assign(block.getTemplate());

			// Now rotate the block position to the correct orientation
			switch (this.rotation) {
				case 0:
					break;
				case 1:
					position.flip().multiply(new Point2D(-1, 1));
					break;
				case 2:
					position.scale(-1);
					break;
				case 3:
					position.flip().multiply(new Point2D(1, -1));
					break;
				default:
					console.error(`Rotation not in limit: ${this.getRotation()}`);
					break;
			}

			// As the position needs to be absolute (relative to the world origin)
			// we add the origin of the tetromino, to make it absolute again.
			position.add(this.origin);
		});
	}
}

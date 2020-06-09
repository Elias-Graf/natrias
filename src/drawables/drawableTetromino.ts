import { Drawable } from '../render';
import { Tetromino } from '../physics/tetromino';
import { Point2D } from '../globals';

export class DrawableTetromino implements Drawable, Tetromino {
	private blocks: Point2D[];
	private origin: Point2D;

	public constructor(origin: Point2D, template: Point2D[]) {
		this.origin = origin;
		this.blocks = template;
	}

	public getOrigin(): Point2D {
		return this.origin.clone();
	}
	public setOrigin(newOrigin: Point2D): void {
		this.origin.assign(newOrigin);
	}
	public getBlocks(): Point2D[] {
		throw new Error('Method not implemented.');
	}
	public setBlocks(newBlocks: Point2D[]): void {
		throw new Error('Method not implemented.');
	}
	public render(): void {
		throw new Error('unimplemented');
	}
}

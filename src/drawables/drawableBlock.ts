import { Drawable } from '../render';
import { Point2D } from '../globals';

export class DrawableBlock implements Drawable {
	private position: Point2D;

	public constructor(position: Point2D) {
		this.position = position;
	}

	public render(): void {
		throw new Error('Method not implemented.');
	}
}

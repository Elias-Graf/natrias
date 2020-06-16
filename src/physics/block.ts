import { Point2D } from '../globals';

export interface Block {
	getPosition(): Point2D;
	onDelete(): void;
	setPosition(position: Point2D): void;
}

import { Point2D } from '../globals';

export interface Tetromino {
	getOrigin(): Point2D;
	setOrigin(newOrigin: Point2D): void;
	getBlocks(): Point2D[];
	setBlocks(newBlocks: Point2D[]): void;
}

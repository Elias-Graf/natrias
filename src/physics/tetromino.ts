import { Point2D } from '../globals';

/**
 * TODO: Replace calculateRotation function with "rotate" function.
 * As we're only ever rotating a single step, and only in one direction (not the band).
 */
export interface Tetromino {
	getOrigin(): Point2D;
	setOrigin(newOrigin: Point2D): void;
	getBlocks(): Point2D[];
	setBlocks(newBlocks: Point2D[]): void;
	getRotation(): number;
	setRotation(newRotation: number): void;
	calculateNextRotation(): number;
	calculateAbsoluteBlocks(): Point2D[];
	clone(): Tetromino;
}

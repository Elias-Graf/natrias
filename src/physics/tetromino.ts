import { Point2D } from '../globals';
import { Block } from './block';

/**
 * TODO: Replace calculateRotation function with "rotate" function.
 * As we're only ever rotating a single step, and only in one direction (not the band).
 */
export interface Tetromino {
	getOrigin(): Point2D;
	setOrigin(newOrigin: Point2D): void;
	// DEPRECATED_getBlocks(): Point2D[];
	// DEPRECATED_setBlocks(newBlocks: Point2D[]): void;
	dissolve(): Block[];
	getRotation(): number;
	setRotation(newRotation: number): void;
	calculateNextRotation(): number;
	calculateAbsoluteBlocks(): Point2D[];
	clone(): Tetromino;
}

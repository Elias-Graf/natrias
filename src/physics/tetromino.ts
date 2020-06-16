import { Point2D } from '../globals';

/**
 * TODO: Replace calculateRotation function with "rotate" function.
 * As we're only ever rotating a single step, and only in one direction (not the band).
 */
export interface Tetromino {
	calculateAbsoluteBlocks(): Point2D[];
	calculateNextRotation(): number;
	/**
	 * Clones the tetromino
	 */
	clone(): Tetromino;
	/**
	 * Returns the origin of the tetromino
	 */
	getOrigin(): Point2D;
	/**
	 * Returns the rotation of the tetromino
	 */
	getRotation(): number;
	/**
	 * Sets the origin of the tetromino
	 * @param origin The new origin
	 */
	setOrigin(origin: Point2D): void;
	/**
	 * Sets the new rotation of the tetromino
	 * @param rotation The new rotation
	 */
	setRotation(rotation: number): void;
}

import { Point2D } from '../globals';
import { TemplateType } from '../tetrominoes/type';

/**
 * TODO: Replace calculateRotation function with "rotate" function.
 * As we're only ever rotating a single step, and only in one direction (not the band).
 */
export interface Tetromino {
	/**
	 * Gets the type of the tetromino
	 */
	getType(): TemplateType;
	/**
	 * Rotates the tetromino by 90deg
	 */
	rotate(): void;
	/**
	 * Calculates and returns the blocks of the tetromino WITH ABSOLUTE COORDINATES
	 * NOT THE TEMPLATE (which is relative)
	 */
	calculateAbsoluteBlocks(): Point2D[];
	/**
	 * Clones the tetromino
	 */
	clone(): Tetromino;
	/**
	 * Get the origin of the tetromino
	 */
	getOrigin(): Point2D;
	/**
	 * Get the rotation of the tetromino
	 */
	getRotation(): number;
	/**
	 * Set the origin of the tetromino
	 * @param origin new origin
	 */
	setOrigin(origin: Point2D): void;
	/**
	 * Set the rotation of the tetromino
	 * @param rotation new rotation
	 */
	setRotation(rotation: number): void;
}

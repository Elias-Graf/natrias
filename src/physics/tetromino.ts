import { Point2D, Dir } from '../globals';
import { TemplateType } from '../tetrominoes/type';
import { Block } from './block';

export interface Tetromino {
	/**
	 * Clones the tetromino
	 */
	clone(): Tetromino;
	/**
	 * Returns the blocks of that the tetromino is made up of
	 */
	getBlocks(): Block[];
	/**
	 * Get the origin of the tetromino
	 */
	getOrigin(): Point2D;
	/**
	 * Get the rotation of the tetromino
	 */
	getRotation(): number;
	/**
	 * Gets the type of the tetromino
	 */
	getType(): TemplateType;
	/**
	 * Move the tetromino in the desired direction
	 * @param direction in what direction should the tetromino move
	 */
	move(direction: Dir): void;
	/**
	 * Rotates the tetromino by 90deg
	 */
	rotate(amount?: number): void;
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
